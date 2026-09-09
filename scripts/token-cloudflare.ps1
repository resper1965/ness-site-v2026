<#
.SYNOPSIS
Grava (ou apaga) o CLOUDFLARE_API_TOKEN como variável de usuário do Windows.

.DESCRIPTION
O token é lido sem aparecer na tela e sem passar pela linha de comando — logo,
não entra no histórico do PowerShell, que é o que acontece quando se cola o
valor direto num SetEnvironmentVariable.

Fica gravado no perfil do usuário até ser apagado. Use um token com o menor
escopo que resolva a tarefa e apague quando terminar.

.EXAMPLE
  .\scripts\token-cloudflare.ps1
  Pede o token e grava.

.EXAMPLE
  .\scripts\token-cloudflare.ps1 -Remover
  Apaga o token gravado.

.EXAMPLE
  .\scripts\token-cloudflare.ps1 -Conferir
  Diz se existe algum token gravado, sem mostrar o valor.
#>
param(
    [switch]$Remover,
    [switch]$Conferir
)

$nome = 'CLOUDFLARE_API_TOKEN'

if ($Remover) {
    [Environment]::SetEnvironmentVariable($nome, $null, 'User')
    Write-Host "$nome apagado do perfil do usuario." -ForegroundColor Green
    Write-Host "Sessoes ja abertas continuam com o valor antigo ate serem reiniciadas."
    return
}

if ($Conferir) {
    $atual = [Environment]::GetEnvironmentVariable($nome, 'User')
    if ($atual) {
        Write-Host "$nome gravado: sim ($($atual.Length) caracteres)." -ForegroundColor Green
    } else {
        Write-Host "$nome gravado: nao." -ForegroundColor Yellow
    }
    return
}

Write-Host "Cole o token da Cloudflare. Ele nao aparece na tela." -ForegroundColor Cyan
$seguro = Read-Host -AsSecureString "Token"

$texto = [Runtime.InteropServices.Marshal]::PtrToStringBSTR(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($seguro)
)

if ([string]::IsNullOrWhiteSpace($texto)) {
    Write-Host "Nada foi digitado. Nenhuma alteracao feita." -ForegroundColor Yellow
    return
}

[Environment]::SetEnvironmentVariable($nome, $texto, 'User')

# Confere lendo de volta, sem imprimir o valor.
$gravado = [Environment]::GetEnvironmentVariable($nome, 'User')
if ($gravado -and $gravado.Length -eq $texto.Length) {
    Write-Host "$nome gravado no perfil do usuario ($($texto.Length) caracteres)." -ForegroundColor Green
    Write-Host "Quando terminar, apague com: .\scripts\token-cloudflare.ps1 -Remover"
} else {
    Write-Host "Falha ao gravar. Verifique permissoes do perfil." -ForegroundColor Red
}

$texto = $null
[GC]::Collect()
