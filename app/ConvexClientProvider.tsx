"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <UserSync />
            {children}
        </ConvexProviderWithClerk>
    );
}

// Separate component to handle the side-effect of syncing
function UserSync() {
    const { user, isLoaded } = useUser();
    const storeUser = useMutation(api.users.store);

    useEffect(() => {
        if (isLoaded && user) {
            // Sync user to Convex on load
            storeUser().catch(err => console.error("User sync failed:", err));
        }
    }, [isLoaded, user, storeUser]);

    return null; // This component renders nothing
}
