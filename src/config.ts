import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { readFile as fsReadFile } from "fs";
import { promisify } from "util";
import { safeLoad } from "js-yaml";
import flatten from "flat";
import mergeDeep from "deepmerge";

const readFile = promisify(fsReadFile);
const client = new SecretManagerServiceClient();

export class Config {
  private readonly values = new Map<string, string>();
  private loaded = false;

  public async load() {
    const initialConfig = await this.loadActiveConfigurationFromFiles();
    Object.entries(initialConfig).forEach(([key, value]) => this.values.set(key, value));
    if (process.env.NODE_ENV === "production") {
      await this.loadGoogleCloudSecrets(this.values.get("secrets") as any);
    }
    this.loaded = true;
  }

  private async loadActiveConfigurationFromFiles(): Promise<Record<string, string>> {
    const [defaultConfig, productionConfig, testConfig] = (
      await Promise.all(
        ["default.yaml", "production.yaml", "test.yaml"].map((file) =>
          readFile(`${__dirname}/../config/${file}`, { encoding: "utf-8" })
        )
      )
    ).map((contents) => safeLoad(contents));

    const env = process.env.NODE_ENV;
    if (env === "production") {
      return flatten(mergeDeep(defaultConfig as any, productionConfig as any));
    } else if (env === "test") {
      return flatten(mergeDeep(defaultConfig as any, testConfig as any));
    } else {
      return flatten(defaultConfig as any);
    }
  }

  private loadGoogleCloudSecrets(entries: Record<string, string>): Promise<void[]> {
    return Promise.all(
      Object.entries(entries).map(async ([key, name]) => {
        const [version] = await client.accessSecretVersion({
          name: `projects/meetnomoreapp/secrets/${name}/versions/latest`,
        });

        const value = version?.payload?.data?.toString();
        if (!value) {
          throw new EmptySecretError(name);
        }
        this.values.set(key, value);
      })
    );
  }

  public get(key: string): any {
    if (this.loaded) {
      return this.values.get(key)!;
    }
    throw new ConfigNotLoaded();
  }
}

export class ConfigNotLoaded extends Error {
  constructor() {
    super("Configuration has not been loaded, but was tried to be accessed");
  }
}

const config = new Config();
export default config;

class EmptySecretError extends Error {
  constructor(name: string) {
    super(`Secret named ${name} is empty`);
  }
}
