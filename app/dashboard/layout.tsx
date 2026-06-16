import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
      <DashboardSidebar />
      <main>{children}</main>
    </div>
  );
}
