import type { Metadata } from "next";
import "./globals.css";
import MobileWarning from "@/components/MobileWarning";

export const metadata: Metadata = {
  title: "ORIGIN Mini — Multi-AI Collaboration Platform",
  description:
    "Chat with 400+ AI models simultaneously. Advanced Reasoning Mode, Codo Mode for GitHub-integrated coding, Multi-Agent Swarm and more. The future of AI collaboration.",
  keywords: ["AI chatbot", "multi-AI", "GPT", "Claude", "Gemini", "advanced reasoning", "code generation"],
  openGraph: {
    title: "ORIGIN Mini — Multi-AI Collaboration Platform",
    description: "Chat with 400+ AI models simultaneously. Advanced Reasoning, Codo Mode, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MobileWarning />
        {children}
      </body>
    </html>
  );
}
