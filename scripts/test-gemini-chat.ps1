param(
  [string]$ModelOverride = ""
)

$ErrorActionPreference = "Stop"

function Get-EnvValue {
  param([string]$Name)
  $line = Get-Content -LiteralPath ".env.local" | Where-Object { $_ -match "^$Name=" } | Select-Object -First 1
  if (-not $line) { throw "$Name is missing from .env.local" }
  return $line.Substring($Name.Length + 1)
}

$model = if ($ModelOverride) { $ModelOverride } else { Get-EnvValue "GEMINI_CHAT_MODEL" }
$key = Get-EnvValue "GEMINI_API_KEY"

$body = @{
  systemInstruction = @{
    parts = @(@{ text = "You are a concise restaurant assistant." })
  }
  contents = @(
    @{
      role = "user"
      parts = @(@{ text = "Say hello and mention Foods Inn." })
    }
  )
  generationConfig = @{
    temperature = 0.2
  }
} | ConvertTo-Json -Depth 20 -Compress

try {
  $response = Invoke-RestMethod `
    -Method Post `
    -Uri "https://generativelanguage.googleapis.com/v1beta/models/$model`:generateContent?key=$key" `
    -ContentType "application/json" `
    -Body ([System.Text.Encoding]::UTF8.GetBytes($body))

  $text = ($response.candidates[0].content.parts | ForEach-Object { $_.text }) -join ""
  Write-Host "ok"
  Write-Host $text
} catch {
  Write-Host "error $($_.Exception.Message)"
  if ($_.ErrorDetails.Message) {
    Write-Host $_.ErrorDetails.Message
  }
  exit 1
}
