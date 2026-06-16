import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

const FOODS_INN_CHAT_URL = "/chat/00000000-0000-0000-0000-000000000000";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[url('https://foodsinn.co/wp-content/uploads/2022/12/foods-inn-karachi.jpg')] bg-cover bg-center">
      <section className="flex min-h-screen items-center justify-center bg-black/60 px-6 py-12 text-center text-white">
        <div className="max-w-3xl">
          <Image
            src="/foods-inn-logo.webp"
            alt="Foods Inn"
            width={128}
            height={128}
            priority
            className="mx-auto rounded-full shadow-2xl shadow-black/30"
          />
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">Foods Inn</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            Chat with Foods Inn
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/85 md:text-lg">
            Ask about the menu, deals, delivery, reservations, location, or recommendations.
          </p>
          <Link
            href={FOODS_INN_CHAT_URL}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-black/20 transition hover:bg-primary/90 focus-ring"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Open Chatbot
          </Link>
        </div>
      </section>
    </main>
  );
}
