import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RestaurantForm } from "@/components/restaurant/RestaurantForm";

export default function RestaurantPage() {
  return <><DashboardHeader title="Restaurant" /><div className="p-6"><Card><CardHeader><CardTitle>Profile</CardTitle></CardHeader><CardContent><RestaurantForm /></CardContent></Card></div></>;
}
