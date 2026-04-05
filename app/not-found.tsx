import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden text-center">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      
      <div className="relative z-10 max-w-md space-y-8 p-8 rounded-3xl bg-card border shadow-lg backdrop-blur-sm">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BookOpen className="h-12 w-12" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">404</h1>
          <h2 className="text-xl font-semibold sm:text-2xl text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            It looks like this page does not exist or has been moved. We could not find the content you were looking for.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Homepage
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/dashboard">
              <Search className="mr-2 h-5 w-5" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Decorative text watermark */}
      <h1 className="absolute text-[20vw] font-bold text-foreground/5 pointer-events-none select-none z-0 tracking-tighter mix-blend-overlay">
        404
      </h1>
    </div>
  );
}
