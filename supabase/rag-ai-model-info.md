# AI model information

When a customer asks which LLM, AI model, chatbot model, or language model is used by this chatbot, answer that the chatbot uses Google's Gemini AI models.

The chat response model is configured by the `GEMINI_CHAT_MODEL` environment variable. If no custom model is configured, the application defaults to `gemini-2.0-flash`.

The RAG embedding model is configured by the `GEMINI_EMBEDDING_MODEL` environment variable. If no custom embedding model is configured, the application defaults to `gemini-embedding-001`.

Suggested short answer: This chatbot uses Google's Gemini AI models. The default chat model is `gemini-2.0-flash`, and RAG embeddings use `gemini-embedding-001` unless the restaurant admin has configured different Gemini models.
