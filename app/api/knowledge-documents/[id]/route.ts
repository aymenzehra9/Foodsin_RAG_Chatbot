import { tableHandlers } from "@/lib/utils/api";
import { knowledgeDocumentSchema } from "@/lib/utils/validators";

const handlers = tableHandlers("knowledge_documents");
type Params = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Params) {
  return handlers.update(request, (await params).id, knowledgeDocumentSchema);
}
export async function DELETE(request: Request, { params }: Params) {
  return handlers.remove(request, (await params).id);
}
