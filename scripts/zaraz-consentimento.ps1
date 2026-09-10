<#
.SYNOPSIS
Configura o consentimento do Zaraz nas três zones da ness.

.DESCRIPTION
Preenche o que falta para o aviso de consentimento existir e governar o GA4:
bloco de consentimento, uma finalidade de medição de audiência com texto em
pt/en/es, e a associação da ferramenta a essa finalidade.

Preserva o que já estiver preenchido — textos de botão que você tenha escrito
não são sobrescritos. Faz cópia de cada configuração antes de tocar em nada.

Precisa de CLOUDFLARE_API_TOKEN no ambiente, com permissão Zone -> Zaraz -> Edit.
Grave com: .\scripts\token-cloudflare.ps1

.EXAMPLE
  .\scripts\zaraz-consentimento.ps1 -Verificar
  Só mostra o estado atual das três zones. Não escreve nada.

.EXAMPLE
  .\scripts\zaraz-consentimento.ps1
  Aplica a configuração e mostra o resultado lido de volta.

.EXAMPLE
  .\scripts\zaraz-consentimento.ps1 -Reverter
  Restaura as configurações a partir da cópia feita antes da aplicação.
#>
param(
    [switch]$Verificar,
    [switch]$Reverter,
    # Sobrescreve os textos mesmo quando ja existem. Sem isto o script so
    # preenche o que esta vazio, para nao apagar copy escrita na interface.
    [switch]$Textos
)

$ErrorActionPreference = 'Stop'

$zonas = @('ness.com.br', 'trustness.com.br', 'forense.io')
$pastaCopia = Join-Path $env:TEMP 'zaraz-backup'

$token = $env:CLOUDFLARE_API_TOKEN
if (-not $token) { $token = [Environment]::GetEnvironmentVariable('CLOUDFLARE_API_TOKEN', 'User') }
if (-not $token) {
    Write-Host "CLOUDFLARE_API_TOKEN nao encontrado. Grave com: .\scripts\token-cloudflare.ps1" -ForegroundColor Red
    return
}
$cabecalhos = @{ Authorization = "Bearer $token"; 'Content-Type' = 'application/json' }

function Get-ZonaId([string]$nome) {
    (Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones?name=$nome" -Headers $cabecalhos).result[0].id
}
function Get-Config([string]$id) {
    (Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$id/settings/zaraz/config" -Headers $cabecalhos).result
}
function Set-Config([string]$id, $config) {
    # O corpo do PUT é a configuração crua, não embrulhada em { zaraz: ... }.
    Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$id/settings/zaraz/config" `
        -Method Put -Headers $cabecalhos -Body ($config | ConvertTo-Json -Depth 30)
}
function Resumo($c) {
    $estado = if ($null -eq $c.consent) { 'nao configurado' }
              elseif ($c.consent.enabled) { 'habilitado' } else { 'desabilitado' }
    $fins = if ($c.consent.purposesWithTranslations) {
        ($c.consent.purposesWithTranslations.PSObject.Properties | ForEach-Object { $_.Name }) -join ', '
    } else { '(nenhuma)' }
    "consentimento: $estado | finalidades: $(if($fins){$fins}else{'(nenhuma)'})"
}

# ── Verificar ────────────────────────────────────────────────────
if ($Verificar) {
    foreach ($z in $zonas) {
        $c = Get-Config (Get-ZonaId $z)
        Write-Host ("{0,-18} {1}" -f $z, (Resumo $c))
    }
    return
}

# ── Reverter ─────────────────────────────────────────────────────
if ($Reverter) {
    foreach ($z in $zonas) {
        $arquivo = Join-Path $pastaCopia "$z.json"
        if (-not (Test-Path $arquivo)) { Write-Host "$z sem copia, pulando." -ForegroundColor Yellow; continue }
        $original = Get-Content $arquivo -Raw | ConvertFrom-Json
        $r = Set-Config (Get-ZonaId $z) $original
        Write-Host "$z restaurado: $($r.success)" -ForegroundColor Green
    }
    return
}

# ── Aplicar ──────────────────────────────────────────────────────
New-Item -ItemType Directory -Force -Path $pastaCopia | Out-Null

$textoAviso = [ordered]@{
    pt = 'Medimos audiência para entender como o site é usado. Nada é compartilhado com anunciantes, e você pode recusar sem perder nenhuma função.'
    en = 'We measure audience to understand how the site is used. Nothing is shared with advertisers, and you can decline without losing any functionality.'
    es = 'Medimos audiencia para entender cómo se usa el sitio. No compartimos nada con anunciantes y puede rechazar sin perder ninguna función.'
}
$finalidade = [ordered]@{
    name = [ordered]@{ pt = 'Medição de audiência'; en = 'Audience measurement'; es = 'Medición de audiencia' }
    description = [ordered]@{
        pt = 'Quantas pessoas visitam o site, por quais páginas passam e de onde vieram.'
        en = 'How many people visit the site, which pages they read and where they came from.'
        es = 'Cuántas personas visitan el sitio, qué páginas leen y de dónde vinieron.'
    }
    order = 0
}
# Rotulo de botao diz o que acontece ao clicar, na voz do site — nao na
# primeira pessoa do visitante ("Aceito tudo", "Rejeito tudo", "Confirmo"),
# que e o padrao que a Zaraz traz e soa como fala de outra pessoa.
$botoes = [ordered]@{
    accept_all = [ordered]@{ pt = 'Aceitar'; en = 'Accept'; es = 'Aceptar' }
    reject_all = [ordered]@{ pt = 'Recusar'; en = 'Decline'; es = 'Rechazar' }
    confirm_my_choices = [ordered]@{ pt = 'Salvar escolhas'; en = 'Save choices'; es = 'Guardar' }
}

<#
O aviso mora num shadow root, num <dialog class="cf_modal">, e a Zaraz injeta
este CSS la dentro. Sem ele o visitante com tema claro no sistema recebe uma
caixa branca de fabrica, que nao tem nada a ver com o site.

Aceitar e recusar tem o mesmo tamanho, a mesma posicao e contraste
equivalente: recusar nao pode ser mais dificil que aceitar. "Salvar escolhas"
e o caminho granular e fica em terceiro plano — sem deixar de ser legivel.
#>
$estilo = @'
.cf_modal_container { color: #dae2fd; }
dialog::backdrop { background-color: rgba(6, 14, 32, .72); backdrop-filter: blur(6px); }
.cf_modal {
  background: #0b1326;
  color: #dae2fd;
  border: 1px solid rgba(255, 255, 255, .10);
  border-radius: 20px;
  padding: 32px;
  max-width: 520px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, .5);
  font-family: Inter, "Inter Fallback", system-ui, sans-serif;
  /* faz a caixa de marcacao nativa nascer escura mesmo em sistema claro */
  color-scheme: dark;
}
#cf_modal_title {
  font-family: Montserrat, "Montserrat Fallback", Inter, sans-serif;
  font-weight: 500;
  font-size: 20px;
  letter-spacing: -.01em;
  text-transform: lowercase;
  color: #ffffff;
  margin: 0;
}
/* o texto vinha justificado, o que abria buracos entre as palavras */
.cf_consent-intro { font-size: 14px; line-height: 1.6; color: #9db0c0; margin: 12px 0 0; text-align: left; }
/* estes tres a Zaraz tambem estiliza; sem !important o dela ganha */
.cf_modal hr {
  border: 0 !important;
  border-top: 1px solid rgba(255, 255, 255, .08) !important;
  background: none !important;
  height: 0 !important;
  margin: 24px 0 !important;
}
.cf_consent-element__checkbox-wrapper { margin-right: 12px !important; }
.cf_consent-element label h3 {
  font-family: Montserrat, "Montserrat Fallback", Inter, sans-serif;
  font-weight: 500; font-size: 15px; color: #ffffff; margin: 0;
}
.cf_consent-element label p { font-size: 13px; line-height: 1.55; color: #9db0c0; margin: 4px 0 0; }
/* a nativa entrava clara mesmo com color-scheme: dark, entao e desenhada */
.cf-checkbox {
  appearance: none !important;
  -webkit-appearance: none !important;
  width: 22px !important;
  height: 22px !important;
  margin: 0 !important;
  flex: 0 0 auto;
  cursor: pointer;
  background: rgba(255, 255, 255, .05) !important;
  border: 1px solid rgba(255, 255, 255, .22) !important;
  border-radius: 6px !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  transition: background-color .15s ease, border-color .15s ease;
}
.cf-checkbox:hover { border-color: rgba(255, 255, 255, .45) !important; }
.cf-checkbox:checked {
  background-color: #00ade8 !important;
  border-color: #00ade8 !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.5 10.5l3 3 6-6.5' fill='none' stroke='%23003549' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
}
.cf-checkbox:focus-visible { outline: 2px solid #00ade8; outline-offset: 2px; }
.cf_consent-buttons {
  display: flex !important;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px !important;
  padding: 0 !important;
  background: transparent !important;
  border: 0 !important;
}
.cf_button {
  font-family: Montserrat, "Montserrat Fallback", Inter, sans-serif;
  font-weight: 500; font-size: 13px;
  min-height: 44px; padding: 12px 24px;
  border: 1px solid transparent; border-radius: 999px;
  cursor: pointer; transition: filter .2s ease, color .2s ease, border-color .2s ease;
}
.cf_button--accept { background: #00ade8; color: #003549; }
.cf_button--reject { background: transparent; color: #00ade8; border-color: #00ade8; }
.cf_button--accept:hover, .cf_button--reject:hover { filter: brightness(1.12); }
.cf_button--save { background: transparent; color: #9db0c0; border-color: rgba(255, 255, 255, .16); }
.cf_button--save:hover { color: #ffffff; border-color: rgba(255, 255, 255, .32); }
.cf_button:focus-visible { outline: 2px solid #00ade8; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .cf_button { transition: none; } }
'@

foreach ($z in $zonas) {
    Write-Host "`n== $z" -ForegroundColor Cyan
    $id = Get-ZonaId $z
    $cfg = Get-Config $id

    $cfg | ConvertTo-Json -Depth 30 | Out-File (Join-Path $pastaCopia "$z.json") -Encoding utf8
    Write-Host "   copia salva"

    if ($null -eq $cfg.consent) {
        $cfg | Add-Member -NotePropertyName consent -NotePropertyValue ([pscustomobject]@{}) -Force
    }
    $consent = $cfg.consent

    # Preserva o que ja existe; preenche o que falta.
    foreach ($par in @(
        @{ n = 'enabled'; v = $true },
        @{ n = 'hideModal'; v = $false },
        @{ n = 'cookieName'; v = 'zaraz-consent' },
        @{ n = 'defaultLanguage'; v = 'pt' },
        @{ n = 'tcfCompliant'; v = $false },
        @{ n = 'customCSS'; v = $estilo },
        @{ n = 'customIntroDisclaimerDismissed'; v = $true }
    )) {
        if ($null -eq $consent.PSObject.Properties[$par.n]) {
            $consent | Add-Member -NotePropertyName $par.n -NotePropertyValue $par.v -Force
        }
    }
    $consent.enabled = $true
    if ($Textos -or -not $consent.customCSS) {
        $consent | Add-Member -NotePropertyName customCSS -NotePropertyValue $estilo -Force
        Write-Host "   estilo do aviso aplicado"
    }

    $temTextoDeBotao = $consent.buttonTextTranslations -and
        ($consent.buttonTextTranslations.PSObject.Properties | Where-Object { $_.Value.PSObject.Properties.Count -gt 0 })
    if ($Textos -or -not $temTextoDeBotao) {
        $consent | Add-Member -NotePropertyName buttonTextTranslations -NotePropertyValue ([pscustomobject]$botoes) -Force
        Write-Host "   textos de botao preenchidos"
    } else {
        Write-Host "   textos de botao ja existiam, preservados"
    }

    $temIntro = $consent.consentModalIntroHTMLWithTranslations -and
        ($consent.consentModalIntroHTMLWithTranslations.PSObject.Properties | Where-Object { $_.Value })
    if ($Textos -or -not $temIntro) {
        $consent | Add-Member -NotePropertyName consentModalIntroHTMLWithTranslations -NotePropertyValue ([pscustomobject]$textoAviso) -Force
        Write-Host "   texto do aviso preenchido"
    } else {
        Write-Host "   texto do aviso ja existia, preservado"
    }

    $temFinalidade = $consent.purposesWithTranslations -and
        $consent.purposesWithTranslations.PSObject.Properties.Count -gt 0
    if ($Textos -or -not $temFinalidade) {
        $consent | Add-Member -NotePropertyName purposesWithTranslations `
            -NotePropertyValue ([pscustomobject]@{ analytics = [pscustomobject]$finalidade }) -Force
        Write-Host "   finalidade 'analytics' escrita"
    } else {
        Write-Host "   finalidade ja existia, preservada"
    }

    # Associa cada ferramenta a finalidade. O campo e `defaultPurpose` — nao
    # esta documentado, foi descoberto lendo o que a interface gravou. Escrever
    # apenas `consent.purposeId`, que parece o campo obvio, nao funciona: a API
    # aceita e o Zaraz ignora, e o aviso nunca aparece.
    foreach ($p in $cfg.tools.PSObject.Properties) {
        $p.Value | Add-Member -NotePropertyName defaultPurpose -NotePropertyValue 'analytics' -Force
    }

    # O cliente le `purposes`, nao so `purposesWithTranslations`.
    if ($Textos -or -not $consent.purposes) {
        $consent | Add-Member -NotePropertyName purposes -NotePropertyValue ([pscustomobject]@{
            analytics = [pscustomobject]@{
                name = $finalidade.name.pt
                description = $finalidade.description.pt
            }
        }) -Force
    }

    try {
        $r = Set-Config $id $cfg
        Write-Host "   escrita: $($r.success)" -ForegroundColor Green
    } catch {
        $msg = if ($_.ErrorDetails.Message) { ($_.ErrorDetails.Message -replace '\s+', ' ') } else { $_.Exception.Message }
        Write-Host "   ERRO: $($msg.Substring(0, [Math]::Min(220, $msg.Length)))" -ForegroundColor Red
        Write-Host "   nada foi alterado nesta zone. Copia intacta em $pastaCopia" -ForegroundColor Yellow
        continue
    }

    $depois = Get-Config $id
    Write-Host "   $(Resumo $depois)"
    $primeira = ($depois.tools.PSObject.Properties | Select-Object -First 1).Value
    if ($primeira.defaultPurpose) {
        Write-Host "   ferramenta associada a finalidade: $($primeira.defaultPurpose)" -ForegroundColor Green
    } else {
        Write-Host "   ferramenta SEM finalidade — o aviso nao vai aparecer" -ForegroundColor Yellow
    }
}

Write-Host "`nPronto. Avise para eu conferir de fora se o aviso aparece e se o GA4 fica parado antes do aceite." -ForegroundColor Cyan
Write-Host "Para desfazer: .\scripts\zaraz-consentimento.ps1 -Reverter"
