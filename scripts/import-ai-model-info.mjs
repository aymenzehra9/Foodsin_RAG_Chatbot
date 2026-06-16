import { readFile } from "node:fs/promises";

const RESTAURANT_ID = "00000000-0000-0000-0000-000000000000";
const TITLE = "AI model information";
const DOCUMENT_PATH = "supabase/rag-ai-model-info.md";

function parseEnv(text) {
  return Object.fromEntries(
    text
      .split(/\r?\n/)
      .map((line) => line.match(/^([^#=]+)=(.*)$/))
      .filter(Boolean)
      .map((match) => [match[1].trim(), match[2].trim()])
  );
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}: ${text}`);
    }

    return text ? JSON.parse(text) : null;
  } finally {
    clearTimeout(timer);
  }
}

const env = parseEnv(await readFile(".env.local", "utf8"));
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = env.GEMINI_API_KEY;
const embeddingModel = env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";

for (const [name, value] of Object.entries({ supabaseUrl, serviceRoleKey, geminiApiKey })) {
  if (!value) throw new Error(`${name} is missing.`);
}

const content = await readFile(DOCUMENT_PATH, "utf8");
const supabaseHeaders = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json"
};

const encodedTitle = encodeURIComponent(TITLE);
await request(`${supabaseUrl}/rest/v1/knowledge_documents?restaurant_id=eq.${RESTAURANT_ID}&title=eq.${encodedTitle}`, {
  method: "DELETE",
  headers: supabaseHeaders
});

const [document] = await request(`${supabaseUrl}/rest/v1/knowledge_documents`, {
  method: "POST",
  headers: { ...supabaseHeaders, Prefer: "return=representation" },
  body: JSON.stringify([
    {
      restaurant_id: RESTAURANT_ID,
      title: TITLE,
      source_type: "manual",
      content,
      metadata: { source: DOCUMENT_PATH, importedBy: "Codex" },
      status: "processing"
    }
  ])
});

const embeddingResponse = await request(
  `https://generativelanguage.googleapis.com/v1beta/models/${embeddingModel}:embedContent?key=${geminiApiKey}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: `models/${embeddingModel}`,
      content: { parts: [{ text: content.replace(/\s+/g, " ").trim() }] },
      taskType: "RETRIEVAL_DOCUMENT",
      outputDimensionality: 1536
    })
  }
);

const embedding = embeddingResponse.embedding?.values ?? embeddingResponse.embeddings?.[0]?.values;
if (!embedding?.length) throw new Error("Gemini did not return an embedding.");

await request(`${supabaseUrl}/rest/v1/knowledge_chunks`, {
  method: "POST",
  headers: supabaseHeaders,
  body: JSON.stringify([
    {
      restaurant_id: RESTAURANT_ID,
      document_id: document.id,
      content,
      chunk_index: 0,
      token_count: Math.ceil(content.length / 4),
      metadata: { sourceType: "manual", title: TITLE },
      embedding
    }
  ])
});

await request(`${supabaseUrl}/rest/v1/knowledge_documents?id=eq.${document.id}`, {
  method: "PATCH",
  headers: supabaseHeaders,
  body: JSON.stringify({ status: "completed" })
});

console.log(`Imported ${TITLE} as ${document.id} with 1 embedded chunk.`);
