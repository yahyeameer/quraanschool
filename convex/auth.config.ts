import { AuthConfig } from "convex/server";

// Use env var for production, fallback to dev domain for local
const clerkDomain = process.env.CLERK_JWT_ISSUER_DOMAIN || "https://leading-lamb-78.clerk.accounts.dev";

export default {
  providers: [
    {
      domain: clerkDomain,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
