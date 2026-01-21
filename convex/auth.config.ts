import { AuthConfig } from "convex/server";

// For now, hardcoding the dev domain to avoid env var issues during local dev
const clerkDomain = "https://leading-lamb-78.clerk.accounts.dev";

export default {
  providers: [
    {
      domain: clerkDomain,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
