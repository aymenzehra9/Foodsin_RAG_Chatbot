import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  return <><DashboardHeader title="Settings" /><div className="p-6"><Card><CardHeader><CardTitle>Chatbot settings</CardTitle></CardHeader><CardContent className="grid gap-4"><Input defaultValue="MenuMate AI" /><Textarea defaultValue="Hi! Welcome to our restaurant. How can I help you today?" /><Input defaultValue="#f97316" /><Button>Save settings</Button></CardContent></Card></div></>;
}
