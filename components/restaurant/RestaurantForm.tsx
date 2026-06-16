import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FOODS_INN_DEMO } from "@/lib/utils/constants";

export function RestaurantForm() {
  return (
    <form className="grid gap-4">
      <Input name="name" defaultValue={FOODS_INN_DEMO.name} placeholder="Restaurant name" />
      <Textarea name="description" defaultValue={FOODS_INN_DEMO.description} placeholder="Description" />
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="phone" defaultValue={FOODS_INN_DEMO.phone} placeholder="Phone" />
        <Input name="whatsapp" defaultValue={FOODS_INN_DEMO.whatsapp} placeholder="WhatsApp" />
        <Input name="website" defaultValue={FOODS_INN_DEMO.website} placeholder="Website" />
        <Input name="city" defaultValue={FOODS_INN_DEMO.city} placeholder="City" />
      </div>
      <Textarea name="address" defaultValue={FOODS_INN_DEMO.address} placeholder="Address" />
      <Button type="button">Save profile</Button>
    </form>
  );
}
