import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthButton from "@/components/AuthButton";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Art Gallery Tracker",
  description: "Track and share art from galleries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <nav className="bg-slate-900 text-white p-4">
            <div className="max-w-4xl mx-auto flex gap-4 items-center">
              <a href="/" className="font-bold">🎨 Art Tracker</a>
              <a href="/art" className="hover:underline">My Art</a>
              <a href="/scan" className="hover:underline">Scan QR</a>
              <a href="/share" className="hover:underline">Share</a>
              <div className="ml-auto">
                <AuthButton />
              </div>
            </div>
          </nav>
          <main className="max-w-4xl mx-auto p-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
