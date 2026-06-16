import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function MenuItemForm() {
  return (
    <form className="grid gap-4">
      <Input placeholder="Item name" />
      <Textarea placeholder="Description" />
      <div className="grid gap-4 md:grid-cols-3">
        <Input type="number" placeholder="Price" />
        <Input placeholder="Spice level" />
        <Input placeholder="Serving size" />
      </div>
      <Button type="button">Save menu item</Button>
    </form>
  );
}
