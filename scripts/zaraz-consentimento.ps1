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
    [switch]$Reverter
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
    pt = 'Usamos medicao de audiencia para entender como o site e usado. Nada e compartilhado com anunciantes, e voce pode recusar sem perder nenhuma funcao.'
    en = 'We measure audience to understand how the site is used. Nothing is shared with advertisers, and you can decline without losing any functionality.'
    es = 'Medimos audiencia para entender como se usa el sitio. No compartimos nada con anunciantes y puede rechazar sin perder ninguna funcion.'
}
$finalidade = [ordered]@{
    name = [ordered]@{ pt = 'Medicao de audiencia'; en = 'Audience measurement'; es = 'Medicion de audiencia' }
    description = [ordered]@{
        pt = 'Quantas pessoas visitam o site, por quais paginas passam e de onde vieram.'
        en = 'How many people visit the site, which pages they read and where they came from.'
        es = 'Cuantas personas visitan el sitio, que paginas leen y de donde vinieron.'
    }
    order = 0
}
$botoes = [ordered]@{
    accept_all = [ordered]@{ pt = 'Aceitar'; en = 'Accept'; es = 'Aceptar' }
    reject_all = [ordered]@{ pt = 'Recusar'; en = 'Decline'; es = 'Rechazar' }
    confirm_my_choices = [ordered]@{ pt = 'Confirmar escolhas'; en = 'Confirm choices'; es = 'Confirmar' }
}

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
        @{ n = 'customCSS'; v = '' },
        @{ n = 'customIntroDisclaimerDismissed'; v = $true }
    )) {
        if ($null -eq $consent.PSObject.Properties[$par.n]) {
            $consent | Add-Member -NotePropertyName $par.n -NotePropertyValue $par.v -Force
        }
    }
    $consent.enabled = $true

    $temTextoDeBotao = $consent.buttonTextTranslations -and
        ($consent.buttonTextTranslations.PSObject.Properties | Where-Object { $_.Value.PSObject.Properties.Count -gt 0 })
    if (-not $temTextoDeBotao) {
        $consent | Add-Member -NotePropertyName buttonTextTranslations -NotePropertyValue ([pscustomobject]$botoes) -Force
        Write-Host "   textos de botao preenchidos"
    } else {
        Write-Host "   textos de botao ja existiam, preservados"
    }

    $temIntro = $consent.consentModalIntroHTMLWithTranslations -and
        ($consent.consentModalIntroHTMLWithTranslations.PSObject.Properties | Where-Object { $_.Value })
    if (-not $temIntro) {
        $consent | Add-Member -NotePropertyName consentModalIntroHTMLWithTranslations -NotePropertyValue ([pscustomobject]$textoAviso) -Force
        Write-Host "   texto do aviso preenchido"
    } else {
        Write-Host "   texto do aviso ja existia, preservado"
    }

    $temFinalidade = $consent.purposesWithTranslations -and
        $consent.purposesWithTranslations.PSObject.Properties.Count -gt 0
    if (-not $temFinalidade) {
        $consent | Add-Member -NotePropertyName purposesWithTranslations `
            -NotePropertyValue ([pscustomobject]@{ analytics = [pscustomobject]$finalidade }) -Force
        Write-Host "   finalidade 'analytics' criada"
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
    if (-not $consent.purposes) {
        $consent | Add-Member -NotePropertyName purposes -NotePropertyValue ([pscustomobject]@{
            analytics = [pscustomobject]@{
                name = 'Medicao de audiencia'
                description = 'Quantas pessoas visitam o site, por quais paginas passam e de onde vieram.'
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
