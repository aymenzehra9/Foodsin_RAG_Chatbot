"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function RegisterForm() {
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: String(formData.get("email")),
      password: String(formData.get("password"))
    });
    setMessage(error ? error.message : "Registration started. Check your email if confirmations are enabled.");
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Password" required minLength={6} />
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <Button className="w-full">Create account</Button>
    </form>
  );
}
