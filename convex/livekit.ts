"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { AccessToken } from "livekit-server-sdk";

export const generateToken = action({
    args: {
        roomName: v.string(),
        participantName: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Get credentials from env
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;

        if (!apiKey || !apiSecret) {
            throw new Error("LiveKit credentials not configured");
        }

        // 2. Create access token
        const at = new AccessToken(apiKey, apiSecret, {
            identity: args.participantName,
            // Token valid for 1 hour
            ttl: "1h",
        });

        // 3. Grant permissions
        at.addGrant({
            roomJoin: true,
            room: args.roomName,
            canPublish: true,
            canSubscribe: true,
        });

        // 4. Serialize
        const token = await at.toJwt();

        return token;
    },
});
