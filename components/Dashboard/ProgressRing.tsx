"use client";

import { motion } from "framer-motion";

export function ProgressRing({ progress, label, subLabel }: { progress: number, label: string, subLabel: string }) {
    const radius = 60;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center py-6">
            <div className="relative flex items-center justify-center">
                {/* Background Circle */}
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="rotate-[-90deg]"
                >
                    <circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="text-muted/20"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + " " + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="text-primary transition-all duration-1000 ease-out"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center text-center">
                    <span className="text-2xl font-bold font-amiri text-foreground">{progress}%</span>
                </div>
            </div>

            <div className="mt-4 text-center">
                <h3 className="text-lg font-bold text-foreground">{label}</h3>
                <p className="text-xs text-muted-foreground">{subLabel}</p>
            </div>
        </div>
    );
}
