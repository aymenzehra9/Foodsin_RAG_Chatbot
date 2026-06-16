import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function FAQForm() {
  return (
    <form className="grid gap-4">
      <Input placeholder="Question" />
      <Textarea placeholder="Answer" />
      <Input placeholder="Category" />
      <Button type="button">Save FAQ</Button>
    </form>
  );
}
