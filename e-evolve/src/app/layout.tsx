import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/AppLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Evolve - Circular Plastic Economy",
  description: "A Hedera-powered circular economy platform connecting consumers, collectors, recyclers, and producers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-neutral-950 text-neutral-50`}>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
