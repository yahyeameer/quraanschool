"use client";

import { Navbar } from "@/components/Landing/Shared/Navbar";
import { Footer } from "@/components/Landing/Shared/Footer";
import { HeroSection } from "@/components/Landing/HeroSection";
import { FeatureGrid } from "@/components/Landing/FeatureGrid";
import { Pricing } from "@/components/Landing/PricingSection";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <HeroSection />

        {/* Dashboard Shortcut for Logged In Users */}
        <div className="container mx-auto px-4">
          <SignedIn>
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-5">
              <div>
                <p className="font-bold text-lg">Welcome back!</p>
                <p className="text-sm text-muted-foreground">You are currently logged in.</p>
              </div>
              <div className="flex gap-4 items-center">
                <Link href="/dashboard/manager">
                  <Button>
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <UserButton />
              </div>
            </div>
          </SignedIn>
        </div>

        <FeatureGrid />
        <Pricing />
      </main>

      <Footer />
    </div>
  );
}
