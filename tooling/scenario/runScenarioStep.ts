import { $, ProcessPromise, chalk } from "zx";

import { ScenarioStep } from "./config";
import { getDidFilesChange, updateFilesHash } from "./didFilesChange";

function watchStdoutAddingPrefix(runner: ProcessPromise<any>, prefix: string) {
  const prefixColored = chalk.blue(`[${prefix}]`);
  runner.stdout.on("data", (chunk) => {
    const line = chunk.toLocaleString();
    console.info(`${prefixColored} ${line}`);
  });
}

export async function runScenarioStep({ commands, dependsOnFiles, hideLogs = false }: ScenarioStep) {
  const shouldSkipAsFilesDidNotChange = !!dependsOnFiles && !(await getDidFilesChange(dependsOnFiles));

  const allCommandsPromise = commands.map(async (command) => {
    console.info(chalk.blue(`Running command ${command}...`));
    const commandRunner = $`${command.split(" ")}`;

    if (shouldSkipAsFilesDidNotChange) {
      console.info(chalk.green(`Command ${command} ignored as no files in ${dependsOnFiles} changed.`));
      return;
    }

    if (!hideLogs) {
      watchStdoutAddingPrefix(commandRunner, command);
    } else {
      console.info(chalk.yellow(`Logs for command ${command} are hidden.`));
    }

    const result = await commandRunner;

    console.info(chalk.blue(`[Done] Running command ${command}`));

    return result;
  });

  await Promise.all(allCommandsPromise);

  if (dependsOnFiles) {
    await updateFilesHash(dependsOnFiles);
  }

  return null;
}
