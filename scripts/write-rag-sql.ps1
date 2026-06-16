param(
  [Parameter(Mandatory = $true)]
  [string]$DocumentPath,

  [string]$OutputPath = "C:\tmp\foods-inn-rag-import.sql",
  [string]$RestaurantId = "00000000-0000-0000-0000-000000000000",
  [string]$DocumentId = "c2723c71-4c37-450c-b8ec-200bce6679b3"
)

$ErrorActionPreference = "Stop"

$content = Get-Content -LiteralPath $DocumentPath -Raw -Encoding UTF8
$content = $content -replace "\$ragdoc\$", "[ragdoc]"

$sql = @"
update knowledge_documents
set
  title = 'Foods Inn RAG Knowledge Base Document',
  source_type = 'manual',
  content = `$ragdoc`$
$content
`$ragdoc`$,
  metadata = '{"source":"attached-pasted-text","importedBy":"Codex"}'::jsonb,
  status = 'pending',
  updated_at = now()
where id = '$DocumentId'
  and restaurant_id = '$RestaurantId';

delete from knowledge_chunks
where document_id = '$DocumentId';
"@

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($OutputPath, $sql, $utf8NoBom)
Write-Host "Wrote SQL import file: $OutputPath"
