import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DealCard } from "@/components/deals/DealCard";
import { DealForm } from "@/components/deals/DealForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DealsPage() {
  return <><DashboardHeader title="Deals" /><div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]"><div className="grid gap-4"><DealCard title="Family Deal" /><DealCard title="BBQ Platter" /></div><Card><CardHeader><CardTitle>Add deal</CardTitle></CardHeader><CardContent><DealForm /></CardContent></Card></div></>;
}
