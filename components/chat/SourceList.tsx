import { Badge } from "@/components/ui/badge";

type Source = { content: string; similarity?: number };

export function SourceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;
  return (
    <div className="space-y-2 border-t pt-3">
      <p className="text-xs font-medium text-muted-foreground">Sources</p>
      {sources.map((source, index) => (
        <div key={`${source.content}-${index}`} className="rounded-md bg-white p-3 text-xs text-muted-foreground">
          <Badge className="mb-2">Source {index + 1}</Badge>
          <p>{source.content}</p>
        </div>
      ))}
    </div>
  );
}
