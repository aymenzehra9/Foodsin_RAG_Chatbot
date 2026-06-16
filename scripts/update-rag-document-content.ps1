param(
  [Parameter(Mandatory = $true)]
  [string]$DocumentPath,

  [string]$DocumentId = "c2723c71-4c37-450c-b8ec-200bce6679b3"
)

$ErrorActionPreference = "Stop"

function Get-EnvValue {
  param([string]$Name)
  $line = Get-Content -LiteralPath ".env.local" | Where-Object { $_ -match "^$Name=" } | Select-Object -First 1
  if (-not $line) { throw "$Name is missing from .env.local" }
  return $line.Substring($Name.Length + 1)
}

$SupabaseUrl = Get-EnvValue "NEXT_PUBLIC_SUPABASE_URL"
$ServiceRoleKey = Get-EnvValue "SUPABASE_SERVICE_ROLE_KEY"
$content = Get-Content -LiteralPath $DocumentPath -Raw -Encoding UTF8

$headers = @{
  apikey = $ServiceRoleKey
  Authorization = "Bearer $ServiceRoleKey"
  "Content-Type" = "application/json"
  Prefer = "return=representation"
}

$body = @(
  @{
    title = "Foods Inn RAG Knowledge Base Document"
    source_type = "manual"
    content = $content
    metadata = @{ source = "attached-pasted-text"; importedBy = "Codex" }
    status = "pending"
  }
) | ConvertTo-Json -Depth 20 -Compress

Invoke-RestMethod `
  -Method Patch `
  -Uri "$SupabaseUrl/rest/v1/knowledge_documents?id=eq.$DocumentId" `
  -Headers $headers `
  -Body $body | Out-Null

Write-Host "Updated knowledge document $DocumentId with $($content.Length) characters."
