import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { Providers } from "@/components/providers";
import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";


const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Brandhook",
  description: "Take your brand further.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic >
      <html lang="en">
        <body
          className={`${roboto.className} antialiased min-h-[calc(100vh-1px)] flex flex-col  text-brand-950`}
        >
          <main className="relative flex-1 flex flex-col">
            <Providers>
              {children}
              <Toaster />
            </Providers>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
