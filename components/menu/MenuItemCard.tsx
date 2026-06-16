import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MenuItemCard({ name, price }: { name: string; price?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Sample item</span>
        <Badge>{price ?? "Verify price"}</Badge>
      </CardContent>
    </Card>
  );
}
