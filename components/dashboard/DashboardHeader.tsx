export function DashboardHeader({ title }: { title: string }) {
  return (
    <header className="flex min-h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">Manage restaurant knowledge, leads, and chatbot behavior.</p>
      </div>
    </header>
  );
}
