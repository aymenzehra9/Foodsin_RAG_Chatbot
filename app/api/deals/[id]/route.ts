import { tableHandlers } from "@/lib/utils/api";
import { dealSchema } from "@/lib/utils/validators";

const handlers = tableHandlers("deals");
type Params = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Params) {
  return handlers.update(request, (await params).id, dealSchema);
}
export async function DELETE(request: Request, { params }: Params) {
  return handlers.remove(request, (await params).id);
}
