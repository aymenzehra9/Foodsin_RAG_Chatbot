import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MenuMate AI",
  description: "RAG-based restaurant chatbot for Foods Inn and restaurant teams.",
  icons: {
    icon: "/foods-inn-logo.webp",
    apple: "/foods-inn-logo.webp"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
