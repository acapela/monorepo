import { Box, BoxProps, Text, useInput } from "ink";
import React, { useEffect, useState } from "react";
import { $, ProcessPromise, chalk } from "zx";

import { useConst } from "~shared/hooks/useConst";

import { CommandRunner, createStepCommandRunner } from "./commandRunner";
import { ScenarioStep } from "./config";
import { getDidFilesChange, updateFilesHash } from "./didFilesChange";
import { CommandLogs } from "./StepCommand";
import { clearConsole } from "./utils";

// function watchStdoutAddingPrefix(runner: ProcessPromise<any>, prefix: string) {
//   const prefixColored = chalk.blue(`[${prefix}]`);
//   runner.stdout.on("data", (chunk) => {
//     const line = chunk.toLocaleString();
//     console.info(`${prefixColored} ${line}`);
//   });
// }

// export async function runScenarioStep({ commands, dependsOnFiles, hideLogs = false }: ScenarioStep) {
//   const shouldSkipAsFilesDidNotChange = !!dependsOnFiles && !(await getDidFilesChange(dependsOnFiles));

//   const allCommandsPromise = commands.map(async (command) => {
//     console.info(chalk.blue(`Running command ${command}...`));
//     const commandRunner = $`${command.split(" ")}`;

//     if (shouldSkipAsFilesDidNotChange) {
//       console.info(chalk.green(`Command ${command} ignored as no files in ${dependsOnFiles} changed.`));
//       return;
//     }

//     if (!hideLogs) {
//       watchStdoutAddingPrefix(commandRunner, command);
//     } else {
//       console.info(chalk.yellow(`Logs for command ${command} are hidden.`));
//     }

//     const result = await commandRunner;

//     console.info(chalk.blue(`[Done] Running command ${command}`));

//     return result;
//   });

//   await Promise.all(allCommandsPromise);

//   if (dependsOnFiles) {
//     await updateFilesHash(dependsOnFiles);
//   }

//   return null;
// }

interface Props {
  step: ScenarioStep;
  onFinished: () => void;
}

export function StepRunner({ step, onFinished }: Props) {
  const [runningCommands, setRunningCommands] = useState<CommandRunner[]>([]);
  const [selectedCommand, setSelectedCommand] = useState<CommandRunner | null>(null);

  useEffect(() => {
    async function init() {
      const commands = await Promise.all(step.commands.map((command) => createStepCommandRunner(step, command)));

      setRunningCommands(commands);

      await Promise.all(commands.map((command) => command.commandRunner));

      onFinished();

      return commands;
    }

    const initPromise = init();

    return () => {
      initPromise.then((commands) => {
        commands.forEach((command) => {
          command.commandRunner?.kill();
        });
      });
    };
  }, []);

  useEffect(() => {
    if (runningCommands.length) {
      setSelectedCommand(runningCommands[0]);
    }
  }, [runningCommands]);

  useInput((input) => {
    const numericInput = parseInt(input);

    if (isNaN(numericInput)) {
      return;
    }

    const requestedCommand = runningCommands[numericInput - 1];

    setTimeout(() => {
      setSelectedCommand((currentCommand) => {
        if (currentCommand === requestedCommand) return currentCommand;

        clearConsole();

        return requestedCommand;
      });
    }, 1);
  });

  return (
    <Box flexDirection="column">
      {selectedCommand && (
        <Box key="logs">
          <CommandLogs runner={selectedCommand} />
        </Box>
      )}
      <Box>
        {runningCommands.map((runner, index) => {
          const isActive = runner === selectedCommand;
          return (
            <Box key={runner.command} borderStyle="round" borderColor="red">
              <Text backgroundColor={isActive ? "red" : undefined}>
                [{index + 1}] {runner.command}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
