"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatInput({ onSend, disabled }: { onSend: (message: string) => void; disabled?: boolean }) {
  return (
    <form
      className="flex gap-2 border-t bg-card p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:p-3"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const input = form.elements.namedItem("message") as HTMLInputElement;
        if (input.value.trim()) onSend(input.value.trim());
        form.reset();
      }}
    >
      <Input name="message" placeholder="Ask about menu, deals, or delivery" disabled={disabled} className="min-w-0" />
      <Button type="submit" size="icon" disabled={disabled} aria-label="Send message" className="shrink-0">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
