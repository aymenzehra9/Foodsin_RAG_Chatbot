import { tableHandlers } from "@/lib/utils/api";
import { menuItemSchema } from "@/lib/utils/validators";

const handlers = tableHandlers("menu_items");
type Params = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Params) {
  return handlers.update(request, (await params).id, menuItemSchema);
}
export async function DELETE(request: Request, { params }: Params) {
  return handlers.remove(request, (await params).id);
}
