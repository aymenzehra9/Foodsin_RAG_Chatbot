import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KnowledgeDocumentForm } from "@/components/knowledge/KnowledgeDocumentForm";
import { KnowledgeDocumentList } from "@/components/knowledge/KnowledgeDocumentList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KnowledgeBasePage() {
  return <><DashboardHeader title="Knowledge base" /><div className="grid gap-6 p-6 lg:grid-cols-[1fr_420px]"><KnowledgeDocumentList /><Card><CardHeader><CardTitle>Add document</CardTitle></CardHeader><CardContent><KnowledgeDocumentForm /></CardContent></Card></div></>;
}
