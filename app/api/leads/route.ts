import { tableHandlers } from "@/lib/utils/api";
import { leadSchema } from "@/lib/utils/validators";

const handlers = tableHandlers("leads");
export const GET = handlers.list;
export const POST = (request: Request) => handlers.create(request, leadSchema);
