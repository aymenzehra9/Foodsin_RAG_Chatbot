import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Overview" />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {["Menu items", "Active deals", "FAQs", "Knowledge docs", "Chat sessions", "Leads"].map((label, index) => (
            <StatsCard key={label} label={label} value={index === 0 ? 22 : 0} />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card><CardHeader><CardTitle>Recent questions</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Customer questions will appear after chats start.</CardContent></Card>
          <Card><CardHeader><CardTitle>Latest leads</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Order and reservation leads will appear here.</CardContent></Card>
        </div>
      </div>
    </>
  );
}
