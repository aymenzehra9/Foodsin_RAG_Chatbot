param(
  [Parameter(Mandatory = $true)]
  [string]$DocumentPath,

  [string]$DocumentId = "c2723c71-4c37-450c-b8ec-200bce6679b3",
  [string]$RestaurantId = "00000000-0000-0000-0000-000000000000",
  [int]$StartIndex = 0,
  [int]$MaxChars = 3500,
  [int]$OverlapChars = 220
)

$ErrorActionPreference = "Stop"

function Get-EnvValue {
  param([string]$Name)
  $line = Get-Content -LiteralPath ".env.local" | Where-Object { $_ -match "^$Name=" } | Select-Object -First 1
  if (-not $line) { throw "$Name is missing from .env.local" }
  return $line.Substring($Name.Length + 1)
}

function Invoke-SupabaseRest {
  param(
    [string]$Method,
    [string]$Path,
    [object]$Body = $null,
    [string]$Prefer = $null
  )

  $headers = @{
    apikey = $ServiceRoleKey
    Authorization = "Bearer $ServiceRoleKey"
    "Content-Type" = "application/json"
  }
  if ($Prefer) { $headers["Prefer"] = $Prefer }

  $uri = "$SupabaseUrl/rest/v1/$Path"
  if ($null -eq $Body) {
    return Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers
  }

  $json = $Body | ConvertTo-Json -Depth 30 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  return Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $bytes
}

function Split-RagText {
  param([string]$Text)

  $normalized = $Text.Replace("`r`n", "`n").Trim()
  $chunks = New-Object System.Collections.Generic.List[string]
  $start = 0

  while ($start -lt $normalized.Length) {
    $hardEnd = [Math]::Min($start + $MaxChars, $normalized.Length)
    $slice = $normalized.Substring($start, $hardEnd - $start)
    $softBreak = [Math]::Max($slice.LastIndexOf("`n---"), [Math]::Max($slice.LastIndexOf("`n## "), $slice.LastIndexOf("`n### ")))
    if ($softBreak -gt [int]($MaxChars * 0.45)) {
      $end = $start + $softBreak
    } else {
      $end = $hardEnd
    }

    $chunk = $normalized.Substring($start, $end - $start).Trim()
    if ($chunk.Length -gt 0) { $chunks.Add($chunk) }
    if ($end -ge $normalized.Length) { break }
    $start = [Math]::Max($end - $OverlapChars, $start + 1)
  }

  return $chunks
}

function Get-GeminiEmbedding {
  param([string]$Text)

  $body = @{
    model = "models/$GeminiEmbeddingModel"
    content = @{ parts = @(@{ text = $Text }) }
    taskType = "RETRIEVAL_DOCUMENT"
    outputDimensionality = 1536
  } | ConvertTo-Json -Depth 20 -Compress

  $uri = "https://generativelanguage.googleapis.com/v1beta/models/$GeminiEmbeddingModel`:embedContent?key=$GeminiApiKey"
  try {
    $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
    $response = Invoke-RestMethod -Method Post -Uri $uri -ContentType "application/json" -Body $bodyBytes
  } catch {
    if ($_.ErrorDetails.Message) {
      Write-Host $_.ErrorDetails.Message
    }
    throw
  }
  return @($response.embedding.values)
}

function Clear-ControlCharacters {
  param([string]$Text)
  return ($Text -replace "[\x00-\x08\x0B\x0C\x0E-\x1F]", " ")
}

$SupabaseUrl = Get-EnvValue "NEXT_PUBLIC_SUPABASE_URL"
$ServiceRoleKey = Get-EnvValue "SUPABASE_SERVICE_ROLE_KEY"
$GeminiApiKey = Get-EnvValue "GEMINI_API_KEY"
$GeminiEmbeddingModel = Get-EnvValue "GEMINI_EMBEDDING_MODEL"

$content = Get-Content -LiteralPath $DocumentPath -Raw -Encoding UTF8
$chunks = @(Split-RagText -Text $content)
Write-Host "Prepared $($chunks.Count) chunks."

if ($StartIndex -eq 0) {
  Invoke-SupabaseRest -Method Patch -Path "knowledge_documents?id=eq.$DocumentId" -Body @{ status = "processing" } | Out-Null
  Invoke-SupabaseRest -Method Delete -Path "knowledge_chunks?document_id=eq.$DocumentId" | Out-Null
}

for ($i = $StartIndex; $i -lt $chunks.Count; $i++) {
  $chunk = Clear-ControlCharacters -Text $chunks[$i]
  $embedding = Get-GeminiEmbedding -Text $chunk

  Invoke-SupabaseRest -Method Post -Path "knowledge_chunks" -Body @(
    @{
      restaurant_id = $RestaurantId
      document_id = $DocumentId
      content = $chunk
      chunk_index = $i
      token_count = [Math]::Ceiling($chunk.Length / 4)
      metadata = @{ title = "Foods Inn RAG Knowledge Base Document"; sourceType = "manual"; chunk = $i }
      embedding = $embedding
    }
  ) | Out-Null

  Write-Host "Inserted chunk $($i + 1) of $($chunks.Count)"
}

Invoke-SupabaseRest -Method Patch -Path "knowledge_documents?id=eq.$DocumentId" -Body @{ status = "completed" } | Out-Null
Write-Host "Completed $($chunks.Count) chunks."
