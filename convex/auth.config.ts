import { AuthConfig } from "convex/server";

// Get Clerk domain from environment variables with fallback for development
const clerkDomain = process.env.NODE_ENV === 'production' 
  ? process.env.CLERK_PROD_DOMAIN 
  : process.env.CLERK_DEV_DOMAIN || "https://leading-lamb-78.clerk.accounts.dev";

if (!clerkDomain) {
  throw new Error("CLERK_DOMAIN environment variable is required");
}

export default {
  providers: [
    {
      domain: clerkDomain,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
