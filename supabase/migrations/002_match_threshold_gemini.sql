create or replace function match_knowledge_chunks (
  query_embedding extensions.vector(1536),
  match_restaurant_id uuid,
  match_count int default 5,
  similarity_threshold float default 0.50
)
returns table (
  id uuid,
  document_id uuid,
  restaurant_id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    knowledge_chunks.id,
    knowledge_chunks.document_id,
    knowledge_chunks.restaurant_id,
    knowledge_chunks.content,
    knowledge_chunks.metadata,
    1 - (knowledge_chunks.embedding <=> query_embedding) as similarity
  from knowledge_chunks
  where knowledge_chunks.restaurant_id = match_restaurant_id
    and knowledge_chunks.embedding is not null
    and 1 - (knowledge_chunks.embedding <=> query_embedding) > similarity_threshold
  order by knowledge_chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;
