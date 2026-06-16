import { tableHandlers } from "@/lib/utils/api";
import { knowledgeDocumentSchema } from "@/lib/utils/validators";

const handlers = tableHandlers("knowledge_documents");
export const GET = handlers.list;
export const POST = (request: Request) => handlers.create(request, knowledgeDocumentSchema);
