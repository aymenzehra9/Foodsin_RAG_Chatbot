import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CategoryForm } from "@/components/menu/CategoryForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoriesPage() {
  return <><DashboardHeader title="Categories" /><div className="p-6"><Card><CardHeader><CardTitle>Add category</CardTitle></CardHeader><CardContent><CategoryForm /></CardContent></Card></div></>;
}
