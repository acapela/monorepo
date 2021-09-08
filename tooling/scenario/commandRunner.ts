import { $ } from "zx";

import { ScenarioStep } from "./config";
import { getDidFilesChange, updateFilesHash } from "./didFilesChange";

export async function createStepCommandRunner(step: ScenarioStep, command: string) {
  const { dependsOnFiles } = step;
  const shouldSkipAsFilesDidNotChange = !!dependsOnFiles && !(await getDidFilesChange(dependsOnFiles));

  const commandRunner = shouldSkipAsFilesDidNotChange ? null : $`${command.split(" ")}`;

  const lines: string[] = [];

  function onNewLine(callback: (line: string) => void) {
    const std = commandRunner?.stdout;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleChunk(chunk: any) {
      const lineString = `${chunk.toLocaleString()}`;

      /**
       * Will remove G and K special cli chars (remove part of cli line, move cursor)
       * Those can mess up the output layout.
       *
       * https://stackoverflow.com/questions/17998978
       */

      // eslint-disable-next-line no-control-regex
      const parsedLine = lineString.replace(/\x1B\[([0-9]{1,3}(;[0-9]{1,2})?)?[GK]/g, "");

      callback(parsedLine);
    }

    std?.on("data", handleChunk);

    return () => {
      std?.off("data", handleChunk);
    };
  }

  commandRunner?.then(() => {
    if (dependsOnFiles) {
      updateFilesHash(dependsOnFiles);
    }
  });

  onNewLine((line) => {
    lines.push(line);
  });

  return {
    command,
    shouldSkipAsFilesDidNotChange,
    commandRunner,
    onNewLine,
    lines,
  };
}

type ThenType<T> = T extends PromiseLike<infer U> ? U : T;

export type CommandRunner = ThenType<ReturnType<typeof createStepCommandRunner>>;
