import React from "react";

import { requestPreviewInMainWindow } from "@aca/desktop/bridge/preview";
import { Button } from "@aca/ui/buttons/Button";

requestPreviewInMainWindow;

export function FocusModeView() {
  return (
    <div>
      <Button
        onClick={() => {
          requestPreviewInMainWindow({ id: 1 });
        }}
      >
        1
      </Button>
      <Button
        onClick={() => {
          requestPreviewInMainWindow({ id: 2 });
        }}
      >
        2
      </Button>
    </div>
  );
}
