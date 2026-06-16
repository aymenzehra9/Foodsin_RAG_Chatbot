import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CategoryForm() {
  return (
    <form className="grid gap-4">
      <Input placeholder="Category name" />
      <Textarea placeholder="Description" />
      <Input type="number" placeholder="Sort order" />
      <Button type="button">Save category</Button>
    </form>
  );
}
