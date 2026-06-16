import { tableHandlers } from "@/lib/utils/api";
import { faqSchema } from "@/lib/utils/validators";

const handlers = tableHandlers("faqs");
type Params = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Params) {
  return handlers.update(request, (await params).id, faqSchema);
}
export async function DELETE(request: Request, { params }: Params) {
  return handlers.remove(request, (await params).id);
}
