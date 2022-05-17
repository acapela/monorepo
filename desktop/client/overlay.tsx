import React from "react";
import { render } from "react-dom";

import { logStorage } from "../bridge/logger";
import { registerLogEntryHandler } from "../domains/dev/makeLogger";
import { ToastsOverlayView } from "../views/toasts/ToastsOverlayView";
import { AppStyleProvider } from "./AppStyleProvider";
import { BackendAlerts } from "./BackendAlerts";

const rootElement = document.getElementById("root");

registerLogEntryHandler((entry) => {
  logStorage.send(entry);
});

function App() {
  return (
    <>
      <AppStyleProvider>
        <BackendAlerts />
        <ToastsOverlayView />
      </AppStyleProvider>
    </>
  );
}

render(<App />, rootElement);
