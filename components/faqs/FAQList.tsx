import { Card, CardContent } from "@/components/ui/card";

export function FAQList() {
  return (
    <div className="grid gap-3">
      {["Where are you located?", "Do you take reservations?", "Are prices inclusive of tax?"].map((question) => (
        <Card key={question}><CardContent className="p-4 text-sm">{question}</CardContent></Card>
      ))}
    </div>
  );
}
