$ErrorActionPreference = "Stop"

function Get-EnvValue {
  param([string]$Name)
  $line = Get-Content -LiteralPath ".env.local" | Where-Object { $_ -match "^$Name=" } | Select-Object -First 1
  if (-not $line) { throw "$Name is missing from .env.local" }
  return $line.Substring($Name.Length + 1)
}

$model = Get-EnvValue "GEMINI_EMBEDDING_MODEL"
$key = Get-EnvValue "GEMINI_API_KEY"

$body = @{
  model = "models/$model"
  content = @{ parts = @(@{ text = "test embedding" }) }
  taskType = "RETRIEVAL_DOCUMENT"
  outputDimensionality = 1536
} | ConvertTo-Json -Depth 10 -Compress

try {
  $response = Invoke-RestMethod `
    -Method Post `
    -Uri "https://generativelanguage.googleapis.com/v1beta/models/$model`:embedContent?key=$key" `
    -ContentType "application/json" `
    -Body $body

  Write-Host "ok $($response.embedding.values.Count)"
} catch {
  Write-Host "error $($_.Exception.Message)"
  if ($_.ErrorDetails.Message) {
    Write-Host $_.ErrorDetails.Message
  }
  exit 1
}
