import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { readFile as fsReadFile, readFileSync } from "fs";
import { promisify } from "util";
import { load } from "js-yaml";
import { get, set } from "lodash";
import mergeDeep from "deepmerge";

const readFile = promisify(fsReadFile);
const googleSecretsClient = new SecretManagerServiceClient();

export class Config {
  private readonly values: Record<string, unknown> = {};
  private loaded = false;

  public async load(): Promise<void> {
    // this is a hack, as we cannot prevent sync loading of all modules in the testing environment,
    // so we currently have to load synchronously in the test environment.
    if (process.env.NODE_ENV === "test") {
      this.loadActiveConfigurationFromFilesSync();
    } else {
      await this.loadActiveConfigurationFromFiles();
      await this.loadGoogleCloudSecrets(this.getValue("overrides.googleCloudSecrets") || {});
    }
    this.loadEnvironmentVariables(this.getValue("overrides.environmentVariables") || {});
    this.loaded = true;
  }

  private async loadActiveConfigurationFromFiles(): Promise<void> {
    const [defaultConfig, productionConfig, testConfig] = (
      await Promise.all(
        ["default.yaml", "production.yaml", "test.yaml"].map((file) =>
          readFile(`${__dirname}/../config/${file}`, { encoding: "utf-8" })
        )
      )
    ).map((contents) => load(contents) as Record<string, unknown>);

    const env = process.env.NODE_ENV;
    let activeConfiguration = defaultConfig;
    if (env === "production") {
      activeConfiguration = mergeDeep(defaultConfig, productionConfig);
    } else if (env === "test") {
      activeConfiguration = mergeDeep(defaultConfig, testConfig);
    }

    Object.entries(activeConfiguration).forEach(([key, value]) => this.setValue(key, value));
  }

  private loadActiveConfigurationFromFilesSync(): void {
    const [defaultConfig, productionConfig, testConfig] = ["default.yaml", "production.yaml", "test.yaml"]
      .map((file) => readFileSync(`${__dirname}/../config/${file}`, { encoding: "utf-8" }))
      .map((contents) => load(contents) as Record<string, unknown>);

    const env = process.env.NODE_ENV;
    let activeConfiguration = defaultConfig;
    if (env === "production") {
      activeConfiguration = mergeDeep(defaultConfig, productionConfig);
    } else if (env === "test") {
      activeConfiguration = mergeDeep(defaultConfig, testConfig);
    }

    Object.entries(activeConfiguration).forEach(([key, value]) => this.setValue(key, value));
  }

  private loadGoogleCloudSecrets(entries: Record<string, string>): Promise<void[]> {
    return Promise.all(
      Object.entries(entries).map(async ([key, name]) => {
        const [version] = await googleSecretsClient.accessSecretVersion({
          name: `projects/meetnomoreapp/secrets/${name}/versions/latest`,
        });

        const value = version?.payload?.data?.toString();
        if (!value) {
          throw new EmptySecretError(name);
        }
        this.setValue(key, value);
      })
    );
  }

  private loadEnvironmentVariables(entries: Record<string, string>): void {
    Object.entries(entries).forEach(([key, value]) => {
      const environmentValue = process.env[value];
      if (!environmentValue) {
        throw new MissingEnvironmentVariable(value);
      } else {
        this.setValue(key, environmentValue);
      }
    });
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  public get(key: string): any {
    if (this.loaded) {
      return this.getValue(key);
    }
    throw new ConfigNotLoaded();
  }

  private setValue(key: string, value: any): void {
    set(this.values, key, value);
  }

  private getValue(key: string): any {
    return get(this.values, key);
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export class ConfigNotLoaded extends Error {
  constructor() {
    super("Configuration has not been loaded, but was tried to be accessed");
  }
}

class EmptySecretError extends Error {
  constructor(name: string) {
    super(`Secret named ${name} is empty`);
  }
}

class MissingEnvironmentVariable extends Error {
  constructor(name: string) {
    super(`No environment variable named ${name}`);
  }
}

const config = new Config();
export default config;

