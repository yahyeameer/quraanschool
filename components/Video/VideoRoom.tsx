"use client";

import { useEffect, useState } from "react";
import {
    LiveKitRoom,
    VideoConference,
    GridLayout,
    ParticipantTile,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

interface VideoRoomProps {
    roomName: string;
    onDisconnected?: () => void;
}

export function VideoRoom({ roomName, onDisconnected }: VideoRoomProps) {
    const { user } = useUser();
    const [token, setToken] = useState("");
    const generateToken = useAction(api.livekit.generateToken);

    useEffect(() => {
        const fetchToken = async () => {
            if (!user) return;

            try {
                const participantName = user.fullName || user.emailAddresses[0]?.emailAddress || "Guest";
                const t = await generateToken({
                    roomName,
                    participantName,
                });
                setToken(t);
            } catch (e) {
                console.error("Failed to generate token:", e);
            }
        };

        fetchToken();
    }, [user, roomName, generateToken]);

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center p-12 h-[400px] bg-black/50 rounded-lg">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
                <p className="text-muted-foreground">Connecting to secure classroom...</p>
            </div>
        );
    }

    return (
        <LiveKitRoom
            video={true}
            audio={true}
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            data-lk-theme="default"
            style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}
            onDisconnected={onDisconnected}
        >
            <VideoConference />
        </LiveKitRoom>
    );
}
