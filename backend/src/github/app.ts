import { App } from "octokit";

export const CLIENT_ID = process.env.GITHUB_CLIENT_ID;

export const githubApp = new App({
  appId: process.env.GITHUB_APP_ID,
  privateKey: Buffer.from(process.env.GITHUB_APP_PRIVATE_KEY, "base64").toString("utf-8"),
  oauth: {
    clientId: CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
  webhooks: {
    secret: process.env.GITHUB_WEBHOOK_SECRET,
  },
});
