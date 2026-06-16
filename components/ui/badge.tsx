import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Badge(props: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      className={cn("inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground", props.className)}
    />
  );
}
