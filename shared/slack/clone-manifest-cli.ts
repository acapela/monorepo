import * as fs from "fs";
import path from "path";

import clipboard from "clipboardy";
import { merge } from "lodash";
import prompts from "prompts";

import manifest from "./manifest.json";

const DEFAULT_DOMAIN = "https://app.acape.la";

function cloneManifestIntoClipboard({ name, domain }: { name: string; domain: string }) {
  const replaceDomain = (url: string) => url.replace(DEFAULT_DOMAIN, domain);
  clipboard.writeSync(
    JSON.stringify(
      merge(manifest, {
        display_information: { name },
        features: {
          bot_user: { display_name: name },
          slash_commands: [
            {
              command: "/" + name.toLowerCase(),
              url: replaceDomain(manifest.features.slash_commands[0].url),
            },
          ],
        },
        oauth_config: {
          redirect_urls: manifest.oauth_config.redirect_urls.map((url) => replaceDomain(url)),
        },
        settings: {
          interactivity: {
            request_url: replaceDomain(manifest.settings.interactivity.request_url),
            message_menu_options_url: replaceDomain(manifest.settings.interactivity.message_menu_options_url),
          },
          event_subscriptions: { request_url: replaceDomain(manifest.settings.event_subscriptions.request_url) },
        },
      } as typeof manifest),
      null,
      2
    )
  );
  console.info("Your manifest has been put into your clipboard!");
}

const manifestDataFilePath = path.join(__dirname, ".manifest-data.json");

if (process.argv.includes("--staging")) {
  cloneManifestIntoClipboard({ name: "Alepaca", domain: "https://app-staging.acape.la" });
} else if (process.argv.includes("--testing")) {
  cloneManifestIntoClipboard({ name: "Testapela", domain: "https://testapela.ngrok.io" });
} else if (!process.argv.includes("--prompt") && fs.existsSync(manifestDataFilePath)) {
  cloneManifestIntoClipboard(JSON.parse(fs.readFileSync(manifestDataFilePath, "utf-8")));
} else {
  prompts(
    [
      {
        type: "text",
        name: "name",
        message: 'Name (e.g. "Fakeapela")?',
        validate: (value) => (value.includes(" ") ? "no spaces please" : true),
      },
      {
        type: "text",
        name: "domain",
        message: 'Domain (e.g. "https://gregapela.ngrok.io")?',
        validate: (value) => {
          try {
            new URL(value);
            return true;
          } catch (e) {
            return "invalid URL";
          }
        },
      },
    ],
    {
      onCancel() {
        process.exit();
      },
    }
  ).then((data) => {
    fs.writeFileSync(manifestDataFilePath, JSON.stringify(data, null, 2));
    cloneManifestIntoClipboard(data);
  });
}
