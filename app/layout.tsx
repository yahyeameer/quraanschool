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

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://quraanschool.app"),
  title: {
    default: "Khalaf Al-Cuduul Quran School",
    template: "%s | Khalaf Al-Cuduul Quran School",
  },
  description: "A premium, state-of-the-art Quran learning management system.",
  openGraph: {
    title: "Khalaf Al-Cuduul Quran School",
    description: "A premium, state-of-the-art Quran learning management system.",
    url: "/",
    siteName: "Khalaf Al-Cuduul Quran School",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khalaf Al-Cuduul Quran School",
    description: "A premium, state-of-the-art Quran learning management system.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${inter.variable} ${amiri.variable} ${notoNaskh.variable} font-sans antialiased`}
            suppressHydrationWarning
          >
            <LanguageProvider>
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
            </LanguageProvider>
          </body>
        </html>
    </ClerkProvider>
  );
}
