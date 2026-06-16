type GeminiTextPart = {
  text?: string;
};

type GeminiGenerateResponse = {
  candidates?: {
    content?: {
      parts?: GeminiTextPart[];
    };
  }[];
  error?: {
    message?: string;
  };
};

type GeminiEmbeddingResponse = {
  embedding?: {
    values?: number[];
  };
  embeddings?: {
    values?: number[];
  }[];
  error?: {
    message?: string;
  };
};

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

function getGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is missing.");
  }
  return key;
}

async function geminiRequest<T>(model: string, method: string, body: unknown): Promise<T> {
  const response = await fetch(`${GEMINI_API_BASE}/${model}:${method}?key=${getGeminiApiKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = (await response.json()) as T & { error?: { message?: string } };
  if (!response.ok) {
    throw new Error(data.error?.message ?? `Gemini API request failed with status ${response.status}`);
  }

  return data;
}

export async function generateGeminiEmbedding(text: string, taskType: "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT" = "RETRIEVAL_QUERY") {
  const model = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";
  const data = await geminiRequest<GeminiEmbeddingResponse>(model, "embedContent", {
    model: `models/${model}`,
    content: {
      parts: [{ text }]
    },
    taskType,
    outputDimensionality: 1536
  });

  const values = data.embedding?.values ?? data.embeddings?.[0]?.values;
  if (!values?.length) {
    throw new Error("Gemini embedding response did not include vector values.");
  }

  return values;
}

export async function generateGeminiText(params: { systemPrompt: string; userPrompt: string }) {
  const model = process.env.GEMINI_CHAT_MODEL || "gemini-2.0-flash";
  const data = await geminiRequest<GeminiGenerateResponse>(model, "generateContent", {
    systemInstruction: {
      parts: [{ text: params.systemPrompt }]
    },
    contents: [
      {
        role: "user",
        parts: [{ text: params.userPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.2
    }
  });

  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
  if (!text) {
    throw new Error("Gemini response did not include text.");
  }

  return text;
}
