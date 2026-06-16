param(
  [Parameter(Mandatory = $true)]
  [string]$DocumentPath,

  [string]$RestaurantId = "00000000-0000-0000-0000-000000000000",
  [string]$Title = "Foods Inn RAG Knowledge Base Document"
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
    apikey        = $ServiceRoleKey
    Authorization = "Bearer $ServiceRoleKey"
    "Content-Type" = "application/json"
  }
  if ($Prefer) { $headers["Prefer"] = $Prefer }

  $uri = "$SupabaseUrl/rest/v1/$Path"
  if ($null -eq $Body) {
    return Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers
  }

  $json = $Body | ConvertTo-Json -Depth 20 -Compress
  return Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $json
}

function Split-RagText {
  param(
    [string]$Text,
    [int]$MaxChars = 2200,
    [int]$OverlapChars = 180
  )

  $normalized = $Text.Replace("`r`n", "`n").Trim()
  $chunks = New-Object System.Collections.Generic.List[string]
  $start = 0

  while ($start -lt $normalized.Length) {
    $hardEnd = [Math]::Min($start + $MaxChars, $normalized.Length)
    $slice = $normalized.Substring($start, $hardEnd - $start)
    $softBreak = [Math]::Max($slice.LastIndexOf("`n---"), [Math]::Max($slice.LastIndexOf("`n## "), $slice.LastIndexOf("`n### ")))
    if ($softBreak -gt [int]($MaxChars * 0.55)) {
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
  param(
    [string]$Text,
    [string]$TaskType
  )

  $body = @{
    model = "models/$GeminiEmbeddingModel"
    content = @{
      parts = @(@{ text = $Text })
    }
    taskType = $TaskType
    outputDimensionality = 1536
  } | ConvertTo-Json -Depth 20 -Compress

  $uri = "https://generativelanguage.googleapis.com/v1beta/models/$GeminiEmbeddingModel`:embedContent?key=$GeminiApiKey"
  $response = Invoke-RestMethod -Method Post -Uri $uri -ContentType "application/json" -Body $body
  return $response.embedding.values
}

$SupabaseUrl = Get-EnvValue "NEXT_PUBLIC_SUPABASE_URL"
$ServiceRoleKey = Get-EnvValue "SUPABASE_SERVICE_ROLE_KEY"
$GeminiApiKey = Get-EnvValue "GEMINI_API_KEY"
$GeminiEmbeddingModel = Get-EnvValue "GEMINI_EMBEDDING_MODEL"

$content = Get-Content -LiteralPath $DocumentPath -Raw -Encoding UTF8
if ([string]::IsNullOrWhiteSpace($content)) {
  throw "Document is empty: $DocumentPath"
}

Invoke-SupabaseRest -Method Delete -Path ("knowledge_documents?restaurant_id=eq.$RestaurantId&title=eq." + [uri]::EscapeDataString($Title)) | Out-Null

$document = Invoke-SupabaseRest -Method Post -Path "knowledge_documents" -Prefer "return=representation" -Body @(
  @{
    restaurant_id = $RestaurantId
    title = $Title
    source_type = "manual"
    content = $content
    metadata = @{ source = "attached-pasted-text"; importedBy = "Codex" }
    status = "processing"
  }
)

$documentId = $document[0].id
$chunks = @(Split-RagText -Text $content)

try {
  for ($i = 0; $i -lt $chunks.Count; $i++) {
    $chunk = $chunks[$i]
    $embedding = @(Get-GeminiEmbedding -Text $chunk -TaskType "RETRIEVAL_DOCUMENT")

    Invoke-SupabaseRest -Method Post -Path "knowledge_chunks" -Body @(
      @{
        restaurant_id = $RestaurantId
        document_id = $documentId
        content = $chunk
        chunk_index = $i
        token_count = [Math]::Ceiling($chunk.Length / 4)
        metadata = @{ title = $Title; sourceType = "manual"; chunk = $i }
        embedding = $embedding
      }
    ) | Out-Null

    Write-Host "Inserted chunk $($i + 1) of $($chunks.Count)"
  }

  Invoke-SupabaseRest -Method Patch -Path "knowledge_documents?id=eq.$documentId" -Body @{ status = "completed" } | Out-Null
  Write-Host "Imported document $documentId with $($chunks.Count) embedded chunks."
} catch {
  Invoke-SupabaseRest -Method Patch -Path "knowledge_documents?id=eq.$documentId" -Body @{ status = "failed" } | Out-Null
  throw
}
