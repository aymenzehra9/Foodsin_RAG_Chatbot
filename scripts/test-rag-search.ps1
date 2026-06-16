param(
  [string]$Question = "What are your popular items?",
  [string]$RestaurantId = "00000000-0000-0000-0000-000000000000"
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
$GeminiApiKey = Get-EnvValue "GEMINI_API_KEY"
$GeminiEmbeddingModel = Get-EnvValue "GEMINI_EMBEDDING_MODEL"

$embeddingBody = @{
  model = "models/$GeminiEmbeddingModel"
  content = @{ parts = @(@{ text = $Question }) }
  taskType = "RETRIEVAL_QUERY"
  outputDimensionality = 1536
} | ConvertTo-Json -Depth 20 -Compress

$embeddingResponse = Invoke-RestMethod `
  -Method Post `
  -Uri "https://generativelanguage.googleapis.com/v1beta/models/$GeminiEmbeddingModel`:embedContent?key=$GeminiApiKey" `
  -ContentType "application/json" `
  -Body ([System.Text.Encoding]::UTF8.GetBytes($embeddingBody))

$rpcBody = @{
  query_embedding = @($embeddingResponse.embedding.values)
  match_restaurant_id = $RestaurantId
  match_count = 5
  similarity_threshold = 0.0
} | ConvertTo-Json -Depth 30 -Compress

$headers = @{
  apikey = $ServiceRoleKey
  Authorization = "Bearer $ServiceRoleKey"
  "Content-Type" = "application/json"
}

$results = Invoke-RestMethod `
  -Method Post `
  -Uri "$SupabaseUrl/rest/v1/rpc/match_knowledge_chunks" `
  -Headers $headers `
  -Body ([System.Text.Encoding]::UTF8.GetBytes($rpcBody))

$results | Select-Object id, document_id, similarity, @{Name = "snippet"; Expression = { $_.content.Substring(0, [Math]::Min(180, $_.content.Length)) } } | ConvertTo-Json -Depth 5
