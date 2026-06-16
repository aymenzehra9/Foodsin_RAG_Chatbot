import { cn } from "@/lib/utils/cn";

function renderInlineText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderFormattedContent(content: string) {
  const blocks = content.trim().split(/\n\s*\n/).filter(Boolean);

  return blocks.map((block, blockIndex) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const bulletItems = lines.map((line) => line.match(/^[-*]\s+(.+)$/)?.[1]);
    const numberItems = lines.map((line) => line.match(/^\d+[.)]\s+(.+)$/)?.[1]);

    if (bulletItems.every(Boolean)) {
      return (
        <ul key={`block-${blockIndex}`} className="list-disc space-y-1 pl-5">
          {bulletItems.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInlineText(item ?? "")}</li>
          ))}
        </ul>
      );
    }

    if (numberItems.every(Boolean)) {
      return (
        <ol key={`block-${blockIndex}`} className="list-decimal space-y-1 pl-5">
          {numberItems.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInlineText(item ?? "")}</li>
          ))}
        </ol>
      );
    }

    return (
      <p key={`block-${blockIndex}`} className="leading-6">
        {lines.map((line, lineIndex) => (
          <span key={`${line}-${lineIndex}`}>
            {renderInlineText(line)}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    );
  });
}

export function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[94%] overflow-hidden rounded-lg px-3 py-2.5 text-sm md:max-w-[82%] md:px-4 md:py-3",
          role === "user"
            ? "bg-primary text-primary-foreground"
            : "border bg-card text-card-foreground shadow-sm"
        )}
      >
        {role === "assistant" ? (
          <div className="space-y-3 break-words">{renderFormattedContent(content)}</div>
        ) : (
          <span className="whitespace-pre-wrap break-words">{content}</span>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-lg border bg-card px-4 py-3 shadow-sm" aria-label="Assistant is typing">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="h-2 w-2 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: `${dot * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
