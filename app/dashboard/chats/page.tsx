import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function ChatsPage() {
  return <><DashboardHeader title="Chats" /><div className="p-6"><Card><CardContent className="p-5 text-sm text-muted-foreground">Saved customer chat sessions will appear here.</CardContent></Card></div></>;
}
