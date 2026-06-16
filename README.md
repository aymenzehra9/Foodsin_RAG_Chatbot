# MenuMate AI

MenuMate AI is a RAG-based restaurant chatbot MVP built with Next.js, TypeScript, Supabase, pgvector, and Gemini. It includes an admin dashboard for restaurant knowledge and a public chat page that answers from retrieved restaurant context.

## Tech Stack

- Next.js App Router and TypeScript
- Tailwind CSS with small shadcn-style UI primitives
- Supabase Auth, Postgres, Storage-ready schema, RLS, and pgvector
- Gemini `gemini-2.5-flash-lite` chat and `gemini-embedding-001` embeddings through the Gemini REST API
- Zod validation

## Features

- Admin auth pages for login, register, and password reset
- Dashboard pages for restaurant profile, categories, menu, deals, FAQs, knowledge base, chats, leads, and settings
- Public `/chat/[restaurantId]` chatbot page
- `/api/chat` RAG flow with chat session/message persistence
- Knowledge document processing into chunks and embeddings
- SQL migration with RLS policies and vector search RPC
- Foods Inn demo seed data

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in Supabase and Gemini values in `.env.local`.

4. Run the Supabase SQL migration from `supabase/migrations/001_initial_schema.sql`.

5. Run `supabase/seed.sql` to add the Foods Inn demo restaurant. The demo restaurant ID is:

```text
00000000-0000-0000-0000-000000000000
```

6. Start locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

## RAG Flow

The chat endpoint validates the request, creates a chat session if needed, saves the user message, embeds the question, calls the Supabase `match_knowledge_chunks` RPC, sends retrieved context to Gemini, saves the assistant response, and returns sources.

## Knowledge Processing

Create a manual knowledge document, then call:

```bash
POST /api/knowledge-documents/[id]/process
```

The app chunks text into roughly 1500-2500 character sections, generates embeddings, stores rows in `knowledge_chunks`, and marks the document completed.

## Deployment

- Deploy the Next.js app to Vercel.
- Use Supabase Cloud for database, auth, storage, and pgvector.
- Add all environment variables to the Vercel project.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only.

## Known Limitations

- PDF/DOCX parsing and file upload UI are schema-ready but not implemented.
- Dashboard forms are UI scaffolds; API routes are ready for connecting mutations.
- Public chat uses the service role key in a server route, so rate limiting should be added before production traffic.
- Demo prices are intentionally omitted and should be verified by the restaurant admin.
