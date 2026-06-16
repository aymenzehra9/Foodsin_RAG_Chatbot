import { Badge } from "@/components/ui/badge";

export function EmbeddingStatusBadge({ status }: { status: string }) {
  const color = status === "completed" ? "bg-green-100 text-green-700" : status === "failed" ? "bg-red-100 text-red-700" : "";
  return <Badge className={color}>{status}</Badge>;
}
