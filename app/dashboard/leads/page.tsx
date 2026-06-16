import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LeadCard } from "@/components/leads/LeadCard";

export default function LeadsPage() {
  return <><DashboardHeader title="Leads" /><div className="grid gap-4 p-6"><LeadCard title="Reservation request" /><LeadCard title="Order inquiry" /></div></>;
}
