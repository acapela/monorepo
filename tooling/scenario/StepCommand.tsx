import { Box, Static, Text } from "ink";
import React, { useEffect, useState } from "react";
import { ProcessPromise, chalk } from "zx";

import { CommandRunner } from "./commandRunner";

interface Props {
  runner: CommandRunner;
}

export function CommandLogs({ runner }: Props) {
  const [logLines, setLogLines] = useState<string[]>([]);

  useEffect(() => {
    setLogLines([...runner.lines]);
    return runner.onNewLine((line) => {
      setLogLines((lines) => [...lines, line]);
    });
  }, [runner]);

  return (
    <Box flexDirection="column">
      {logLines.slice(0, 5).map((line, index) => {
        return (
          <Box key={index + line}>
            <Text>{line}</Text>
          </Box>
        );
      })}
    </Box>
  );

  return (
    <Static key={runner.command} items={logLines}>
      {(line, index) => {
        return (
          <Box key={index}>
            <Text>{line}</Text>
          </Box>
        );
      }}
    </Static>
  );
}
