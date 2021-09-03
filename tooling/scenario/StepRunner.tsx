import { Box, Text, useInput } from "ink";
import React, { useEffect, useState } from "react";

import { CommandLogs } from "./CommandLogs";
import { CommandRunner, createStepCommandRunner } from "./commandRunner";
import { ScenarioStep } from "./config";
import { clearConsole } from "./utils";

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
