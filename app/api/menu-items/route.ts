import { tableHandlers } from "@/lib/utils/api";
import { menuItemSchema } from "@/lib/utils/validators";

const handlers = tableHandlers("menu_items");
export const GET = handlers.list;
export const POST = (request: Request) => handlers.create(request, menuItemSchema);
