import { Card, CardContent } from "@/components/ui/card";
import { EmbeddingStatusBadge } from "./EmbeddingStatusBadge";

export function KnowledgeDocumentList() {
  return (
    <div className="grid gap-3">
      {["Foods Inn profile", "Menu samples", "Restaurant FAQs"].map((title) => (
        <Card key={title}>
          <CardContent className="flex items-center justify-between p-4">
            <span className="font-medium">{title}</span>
            <EmbeddingStatusBadge status="pending" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
