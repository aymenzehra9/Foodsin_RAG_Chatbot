import { ChatWindow } from "@/components/chat/ChatWindow";

type Props = { params: Promise<{ restaurantId: string }> };

export default async function ChatPage({ params }: Props) {
  const { restaurantId } = await params;
  return (
    <main className="h-[100svh] overflow-hidden bg-background p-0 md:min-h-screen md:p-4">
      <ChatWindow restaurantId={restaurantId} />
    </main>
  );
}
