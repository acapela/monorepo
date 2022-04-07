import { App, OAuthApp } from "octokit";

export const githubOnboardingApp = new OAuthApp({
  clientId: process.env.GITHUB_ONBOARDING_OAUTH_CLIENT_ID!,
  clientSecret: process.env.GITHUB_ONBOARDING_OAUTH_CLIENT_SECRET!,
  defaultScopes: ["repo", "user"],
});

export const githubApp = new App({
  appId: process.env.GITHUB_APP_ID,
  privateKey: Buffer.from(process.env.GITHUB_APP_PRIVATE_KEY, "base64").toString("utf-8"),
  oauth: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
  webhooks: {
    secret: process.env.GITHUB_WEBHOOK_SECRET,
  },
});
