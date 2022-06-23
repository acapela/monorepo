import { uniq } from "lodash";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { useEffectOnce, useList } from "react-use";
import styled from "styled-components";

import { LogEntry, getAllLogsBridge, logStorage } from "@aca/desktop/bridge/logger";
import { MultipleOptionsDropdown } from "@aca/ui/forms/OptionsDropdown/multiple";
import { theme } from "@aca/ui/theme";

import { devSettingsStore } from "../domains/dev/store";
import { NewBrowserWindow } from "../domains/window/NewBrowserWindow";

export const LoggerWindowManager = observer(function LoggerWindowManager() {
  const { showLogsWindow } = devSettingsStore;

  if (!showLogsWindow) return null;

  return (
    <NewBrowserWindow
      onClosed={() => {
        devSettingsStore.showLogsWindow = false;
      }}
    >
      <LoggerWindow />
    </NewBrowserWindow>
  );
});

const LoggerWindow = observer(function LoggerWindow() {
  const [allLogs, { push: addLog, set: setLogEntryList }] = useList<LogEntry>([]);
  const [filteredPrefixes, { set: setFilteredPrefixes }] = useList<string>([]);

  useEffectOnce(() => {
    getAllLogsBridge().then((logs) => setLogEntryList(logs));
    logStorage.subscribe((entry) => {
      addLog(entry);
    });
  });

  const prefixes = useMemo(() => uniq(allLogs.map((l) => l.prefix)), [allLogs]);
  const filteredLogs = useMemo(
    () => allLogs.filter((log) => filteredPrefixes.length === 0 || filteredPrefixes.includes(log.prefix)),
    [filteredPrefixes, allLogs]
  );

  function handleFilterChange(selectedPrefixes: string[]) {
    setFilteredPrefixes(selectedPrefixes);
  }

  return (
    <UIHolder>
      <UIFilters>
        <MultipleOptionsDropdown
          items={prefixes}
          keyGetter={(prefix) => prefix}
          labelGetter={(prefix) => prefix}
          selectedItems={filteredPrefixes}
          onChange={handleFilterChange}
        />
      </UIFilters>
      <UILogEntryList>
        {filteredLogs.map((log) => (
          <UILogEntry key={log.id}>
            [{log.prefix}][{log.severity}][{log.timestamp}]: {log.text}
          </UILogEntry>
        ))}
      </UILogEntryList>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  width: 100%;
`;

const UIFilters = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UILogEntryList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  div:nth-child(even) {
    ${theme.colors.inverted.asBgWithReadableText}
  }
`;

const UILogEntry = styled.div`
  width: 100%;
  padding: 4px;
  white-space: pre-wrap;

  ${theme.typo.noteTitle.secondary}
`;
