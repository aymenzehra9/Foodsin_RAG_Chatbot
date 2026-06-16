import { tableHandlers } from "@/lib/utils/api";
import { dealSchema } from "@/lib/utils/validators";

const handlers = tableHandlers("deals");
export const GET = handlers.list;
export const POST = (request: Request) => handlers.create(request, dealSchema);
