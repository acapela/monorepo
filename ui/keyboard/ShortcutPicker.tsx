import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Button } from "../buttons/Button";
import { recordShortcut } from "./recordShortcut";
import { ShortcutKeys } from "./shortcutBase";
import { ShortcutDescriptor } from "./ShortcutLabel";

interface Props {
  currentShortcut?: ShortcutKeys;
  onChange?: (shortcut: ShortcutKeys) => void;
  onClearRequest?: () => void;
}

export function ShortcutPicker({ currentShortcut, onChange, onClearRequest }: Props) {
  const [inProgressKeys, setInProgressKeys] = useState<ShortcutKeys | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!isRecording) return;

    const [newShortcutPromise, cancel] = recordShortcut({ onNextKey: setInProgressKeys });

    newShortcutPromise.then((newShortcut) => {
      setIsRecording(false);
      setInProgressKeys(null);
      if (newShortcut === null) return;

      onChange?.(newShortcut);
    });

    return cancel;
  }, [isRecording]);

  async function startRecording() {
    setIsRecording(true);
  }

  const shortcutToShow = inProgressKeys ?? currentShortcut;
  return (
    <UIHolder>
      {!!currentShortcut && onClearRequest && (
        <Button tooltip="Remove shortcut" kind="primarySubtle" onClick={onClearRequest}>
          Clear
        </Button>
      )}
      <Button
        data-tooltip={currentShortcut ? "Click to change" : undefined}
        onClick={startRecording}
        kind={isRecording ? "primarySubtle" : "secondary"}
      >
        {shortcutToShow && <ShortcutDescriptor shortcut={shortcutToShow} />}
        {!shortcutToShow && (
          <>
            {isRecording && "Press keys"}
            {!isRecording && "Click to record"}
          </>
        )}
      </Button>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  gap: 4px;
`;
