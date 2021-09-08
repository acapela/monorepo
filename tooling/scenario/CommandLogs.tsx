import { Box, Text } from "ink";
import React, { useEffect, useState } from "react";

import { CommandRunner } from "./commandRunner";

interface Props {
  runner: CommandRunner;
}

export function CommandLogs({ runner }: Props) {
  const [logLines, setLogLines] = useState<string[]>(() => {
    return [...runner.lines];
  });

  useEffect(() => {
    return runner.onNewLine((line) => {
      setLogLines((lines) => [...lines, line]);
    });
  }, [runner]);

  return (
    <Box flexDirection="column">
      {logLines.map((line, index) => {
        return (
          <Box key={index + line}>
            <Text>{line}</Text>
          </Box>
        );
      })}
    </Box>
  );
}
