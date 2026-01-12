import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://leading-lamb-78.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
