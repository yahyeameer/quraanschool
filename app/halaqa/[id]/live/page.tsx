"use client";

import { useParams, useRouter } from "next/navigation";
import { VideoRoom } from "@/components/Video/VideoRoom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function LiveClassPage() {
    const params = useParams();
    const router = useRouter();
    const classId = params.id as string;

    // Use class id as room name
    const roomName = `class-${classId}`;

    return (
        <div className="space-y-4 h-[calc(100vh-100px)]">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold font-amiri text-white">Live Classroom</h1>
                    <p className="text-muted-foreground text-sm">Room: {roomName}</p>
                </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 overflow-hidden bg-black/80 shadow-2xl">
                <VideoRoom
                    roomName={roomName}
                    onDisconnected={() => router.push("/halaqa")}
                />
            </div>
        </div>
    );
}
