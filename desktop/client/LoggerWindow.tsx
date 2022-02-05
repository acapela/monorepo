import { observer } from "mobx-react";
import React from "react";
import { useEffectOnce, useList } from "react-use";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

import { LogEntry, getAllLogsBridge, logStorage } from "../bridge/logger";
import { desktopRouter } from "../routes";

const LOGGER_WINDOW_NAME = "logger";

export function isLoggerWindow() {
  return window.name === LOGGER_WINDOW_NAME;
}

export const LoggerWindow = observer(function LoggerWindow() {
  const [allLogs, { push: addLog, set: setLogEntryList }] = useList<LogEntry>([]);
  useEffectOnce(() => {
    if (!isLoggerWindow()) {
      window.open(desktopRouter.createURL("home"), LOGGER_WINDOW_NAME);
    } else {
      getAllLogsBridge().then((logs) => setLogEntryList(logs));
      logStorage.subscribe((entry) => {
        addLog(entry);
      });
    }
  });

  if (!isLoggerWindow()) {
    return <></>;
  }

  return (
    <UILogEntryList>
      {allLogs.map((log) => (
        <UILogEntry key={log.id}>
          [{log.prefix}][{log.severity}][{log.timestamp}]: {log.text}
        </UILogEntry>
      ))}
    </UILogEntryList>
  );
});

const UILogEntryList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const UILogEntry = styled.div`
  width: 100%;
  padding: 4px;
  ${theme.colors.layout.actionPanel.asBgWithReadableText};
  ${theme.typo.item.secondaryTitle}
`;
