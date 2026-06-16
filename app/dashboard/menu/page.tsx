import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuItemForm } from "@/components/menu/MenuItemForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MenuPage() {
  const items = ["Chicken Chowmein", "Singaporean Rice", "Chicken Tikka", "Mint Margarita"];
  return <><DashboardHeader title="Menu" /><div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]"><div className="grid gap-4 md:grid-cols-2">{items.map((item) => <MenuItemCard key={item} name={item} />)}</div><Card><CardHeader><CardTitle>Add item</CardTitle></CardHeader><CardContent><MenuItemForm /></CardContent></Card></div></>;
}
