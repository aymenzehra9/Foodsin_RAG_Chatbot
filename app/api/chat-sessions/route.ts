import { tableHandlers } from "@/lib/utils/api";

const handlers = tableHandlers("chat_sessions");
export const GET = handlers.list;
