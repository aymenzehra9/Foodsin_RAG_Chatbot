import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "focus-ring min-h-28 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-muted-foreground",
        props.className
      )}
    />
  );
}
