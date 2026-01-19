"use client";
import createGlobe from "cobe";
import { useCallback, useEffect, useRef } from "react";

export function Globe({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: [
                // location of Somalia
                { location: [5.1521, 46.1996], size: 0.1 },
                // Mecca
                { location: [21.3891, 39.8579], size: 0.1 }
            ],
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.01;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <div className={`relative flex h-full w-full max-w-[600px] items-center justify-center overflow-hidden rounded-lg bg-background px-40 pb-40 pt-8 md:pb-60 md:shadow-xl ${className}`}>
            <canvas
                ref={canvasRef}
                style={{
                    width: 600,
                    height: 600,
                    maxWidth: "100%",
                    aspectRatio: 1,
                }}
            />
        </div>
    );
}
