import { $, ProcessOutput, ProcessPromise } from "zx";

import { getDidFilesChange, updateFilesHash } from "./tooling/scenario/didFilesChange";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
process.env.FORCE_COLOR = 3;

type Command = ProcessPromise<ProcessOutput>;

interface CommandInfo {
  name: string;
  command: Command;
  dependsOnFiles?: string;
}

async function runCommandIfNeeded({ command, dependsOnFiles, name }: CommandInfo) {
  if (dependsOnFiles && !(await getDidFilesChange(dependsOnFiles))) {
    console.info(`Skipping "${name}" - no files changed in ${dependsOnFiles}`);
    return;
  }

  await command;

  if (dependsOnFiles) {
    await updateFilesHash(dependsOnFiles);
  }
}

async function runCommandsInParell(commands: CommandInfo[]) {
  await Promise.all(commands.map((command) => command.command));
}

async function start() {
  await runCommandIfNeeded({ command: $`yarn install`, name: "Yarn install", dependsOnFiles: "yarn.lock" });
  await runCommandIfNeeded({ command: $`yarn run docker:up:detach`, name: "Docker" });
  await runCommandIfNeeded({
    command: $`yarn hasura:update`,
    dependsOnFiles: "infrastructure/hasura/**",
    name: "Docker",
  });
  await runCommandIfNeeded({
    command: $`yarn db update`,
    dependsOnFiles: "infrastructure/hasura/migrations/**",
    name: "Docker",
  });

  await runCommandsInParell([
    { command: $`yarn frontend:dev`, name: "Frontend" },
    { command: $`yarn backend:dev`, name: "Backend" },
    { command: $`yarn tooling:gql-types`, name: "GQL Tooling" },
    { command: $`yarn hasura:console`, name: "Hasura console" },
    { command: $`yarn desktop dev`, name: "Desktop" },
  ]);
}

start();
