import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function KnowledgeDocumentForm() {
  return (
    <form className="grid gap-4">
      <Input placeholder="Document title" />
      <Textarea placeholder="Paste restaurant knowledge, menu notes, FAQs, policies, or delivery details" className="min-h-56" />
      <Button type="button">Save knowledge document</Button>
    </form>
  );
}
