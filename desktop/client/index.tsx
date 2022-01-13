import React from "react";
import { render } from "react-dom";

import { TestView } from "@aca/desktop/views/TestView";
import { Button } from "@aca/ui/buttons/Button";

const rootElement = document.getElementById("root");

render(
  <div>
    <Button kind="primary">Button test</Button>
    Hello from react <TestView />
  </div>,
  rootElement
);
