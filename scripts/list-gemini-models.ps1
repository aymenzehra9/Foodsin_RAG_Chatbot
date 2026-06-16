$ErrorActionPreference = "Stop"

function Get-EnvValue {
  param([string]$Name)
  $line = Get-Content -LiteralPath ".env.local" | Where-Object { $_ -match "^$Name=" } | Select-Object -First 1
  if (-not $line) { throw "$Name is missing from .env.local" }
  return $line.Substring($Name.Length + 1)
}

$key = Get-EnvValue "GEMINI_API_KEY"
$response = Invoke-RestMethod -Method Get -Uri "https://generativelanguage.googleapis.com/v1beta/models?key=$key"
$response.models |
  Where-Object { $_.supportedGenerationMethods -contains "generateContent" } |
  Select-Object name, displayName, supportedGenerationMethods |
  ConvertTo-Json -Depth 5
