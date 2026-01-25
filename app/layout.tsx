import type { Metadata } from "next";
import { Inter, Amiri, Noto_Naskh_Arabic } from "next/font/google"; // Updated fonts
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { AppShell } from "@/components/Layout/AppShell";
import { LanguageProvider } from "@/lib/language-context";
import { BrandBackground } from "@/components/ui/brand-background";
import { ThemeProvider } from "@/components/theme-provider";
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
      <LanguageProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${inter.variable} ${amiri.variable} ${notoNaskh.variable} font-sans antialiased`}
            suppressHydrationWarning
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="dark" // Defaulting to dark for Project 1000x aesthetic
              enableSystem
              disableTransitionOnChange
            >
              <BrandBackground />
              <ConvexClientProvider>
                <AppShell>{children}</AppShell>
              </ConvexClientProvider>
            </ThemeProvider>
          </body>
        </html>
      </LanguageProvider>
    </ClerkProvider>
  );
}
