import { Card, CardContent } from "@/components/ui/card";
import { LeadStatusSelect } from "./LeadStatusSelect";

export function LeadCard({ title }: { title: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">Customer inquiry captured from chat.</p>
        </div>
        <LeadStatusSelect />
      </CardContent>
    </Card>
  );
}
