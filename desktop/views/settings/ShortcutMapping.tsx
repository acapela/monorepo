import { upperFirst } from "lodash";
import { observer } from "mobx-react";
import React, { useState } from "react";

import { globalShortcutsValue } from "@aca/desktop/bridge/system";
import { isNotNullish } from "@aca/shared/nullish";
import { Button } from "@aca/ui/buttons/Button";
import { TextInput } from "@aca/ui/forms/TextInput";
import { HStack } from "@aca/ui/Stack";

const modifiers = ["Shift", "Alt", "Meta", "Control"] as const;

const buildElectronShortcutStringFromKeyboardEvent = (event: React.KeyboardEvent<unknown>) =>
  [
    event.ctrlKey || event.metaKey ? "CommandOrControl" : null,
    event.shiftKey ? "Shift" : null,
    event.altKey ? "Alt" : null,
    event.key == " " ? "Space" : upperFirst(event.key),
  ]
    .filter(isNotNullish)
    .join("+");

export const ShortcutMapping = observer(() => {
  const currentValue = globalShortcutsValue.get().show;
  const [value, setValue] = useState(currentValue);
  return (
    <HStack>
      <div style={{ width: "100%" }}>
        <TextInput
          placeholder="System shortcut to show Acapela"
          value={value ?? 'Disabled (To enable: use desired shortcut in this field and press "Enable")'}
          onKeyDown={(event) => {
            if (modifiers.includes(event.key as never)) {
              // For modifier keys we switch back to the current value
              setValue(currentValue);
            } else {
              setValue(buildElectronShortcutStringFromKeyboardEvent(event));
            }
          }}
        />
      </div>
      <Button
        kind="transparent"
        onClick={() => {
          setValue(null);
          globalShortcutsValue.set({ show: null });
        }}
      >
        Disable
      </Button>
      <Button
        kind="primary"
        isDisabled={!value || value == currentValue}
        onClick={() => {
          globalShortcutsValue.set({ show: value });
        }}
      >
        {currentValue ? "Update" : "Enable"}
      </Button>
    </HStack>
  );
});
