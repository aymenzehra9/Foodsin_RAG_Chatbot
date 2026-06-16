import { tableHandlers } from "@/lib/utils/api";
import { leadSchema } from "@/lib/utils/validators";

const handlers = tableHandlers("leads");
type Params = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Params) {
  return handlers.update(request, (await params).id, leadSchema);
}
