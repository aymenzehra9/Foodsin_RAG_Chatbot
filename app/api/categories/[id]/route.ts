import { tableHandlers } from "@/lib/utils/api";
import { categorySchema } from "@/lib/utils/validators";

const handlers = tableHandlers("menu_categories");
type Params = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Params) {
  return handlers.update(request, (await params).id, categorySchema);
}
export async function DELETE(request: Request, { params }: Params) {
  return handlers.remove(request, (await params).id);
}
