import Link from "next/link";
import { Bot, ClipboardList, HelpCircle, Home, MessageSquare, Percent, Settings, Utensils } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/restaurant", label: "Restaurant", icon: Utensils },
  { href: "/dashboard/categories", label: "Categories", icon: ClipboardList },
  { href: "/dashboard/menu", label: "Menu", icon: Utensils },
  { href: "/dashboard/deals", label: "Deals", icon: Percent },
  { href: "/dashboard/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/dashboard/knowledge-base", label: "Knowledge", icon: Bot },
  { href: "/dashboard/chats", label: "Chats", icon: MessageSquare },
  { href: "/dashboard/leads", label: "Leads", icon: ClipboardList },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export function DashboardSidebar() {
  return (
    <aside className="border-r bg-white">
      <div className="p-5">
        <Link href="/dashboard" className="text-lg font-semibold">MenuMate AI</Link>
      </div>
      <nav className="grid gap-1 px-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted">
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
