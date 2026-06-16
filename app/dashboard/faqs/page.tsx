import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FAQForm } from "@/components/faqs/FAQForm";
import { FAQList } from "@/components/faqs/FAQList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQsPage() {
  return <><DashboardHeader title="FAQs" /><div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]"><FAQList /><Card><CardHeader><CardTitle>Add FAQ</CardTitle></CardHeader><CardContent><FAQForm /></CardContent></Card></div></>;
}
