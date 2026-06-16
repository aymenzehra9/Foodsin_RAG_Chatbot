import { ChatWindow } from "@/components/chat/ChatWindow";

type Props = { params: Promise<{ restaurantId: string }> };

export default async function ChatPage({ params }: Props) {
  const { restaurantId } = await params;
  return (
    <main className="min-h-screen bg-background p-0 md:p-4">
      <ChatWindow restaurantId={restaurantId} />
    </main>
  );
}
