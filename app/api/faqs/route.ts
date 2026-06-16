import { tableHandlers } from "@/lib/utils/api";
import { faqSchema } from "@/lib/utils/validators";

const handlers = tableHandlers("faqs");
export const GET = handlers.list;
export const POST = (request: Request) => handlers.create(request, faqSchema);
