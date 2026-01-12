import type { Metadata } from "next";
import { Inter, Amiri, Noto_Naskh_Arabic } from "next/font/google"; // Updated fonts
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { AppShell } from "@/components/Layout/AppShell";
import "./globals.css";

// Font configurations
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
});
const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "Khalaf Al-Cuduul Quran School",
  description: "A premium Quran learning management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${amiri.variable} ${notoNaskh.variable} font-sans antialiased`}
        >
          <ConvexClientProvider>
            <AppShell>{children}</AppShell>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
