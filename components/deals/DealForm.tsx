import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function DealForm() {
  return (
    <form className="grid gap-4">
      <Input placeholder="Deal title" />
      <Textarea placeholder="Description" />
      <Input type="number" placeholder="Price" />
      <Textarea placeholder="Terms" />
      <Button type="button">Save deal</Button>
    </form>
  );
}
