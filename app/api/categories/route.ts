import { tableHandlers } from "@/lib/utils/api";
import { categorySchema } from "@/lib/utils/validators";

const handlers = tableHandlers("menu_categories");
export const GET = handlers.list;
export const POST = (request: Request) => handlers.create(request, categorySchema);
