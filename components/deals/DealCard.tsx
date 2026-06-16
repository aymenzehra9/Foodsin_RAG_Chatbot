import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DealCard({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground">Active restaurant deal shown to the chatbot.</CardContent>
    </Card>
  );
}
