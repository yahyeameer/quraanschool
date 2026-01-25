"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="p-1 rounded-full bg-accent/20 border border-border h-9 w-[108px]" />
    }

    return (
        <div className="flex items-center gap-2 p-1 rounded-full bg-accent/20 border border-border backdrop-blur-sm">
            <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-white text-orange-500 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                title="Light Mode"
            >
                <Sun className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-slate-950 text-emerald-400 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                title="Dark Mode"
            >
                <Moon className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${theme === 'system' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                title="System Preference"
            >
                Auto
            </button>
        </div>
    )
}
