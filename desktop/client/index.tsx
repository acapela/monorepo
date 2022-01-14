import React, { useEffect } from "react";
import { render } from "react-dom";

import { getFoo, pingPongChannel } from "@aca/desktop/bridge/foo";
import { TestView } from "@aca/desktop/views/TestView";
import { createInterval } from "@aca/shared/time";
import { Button } from "@aca/ui/buttons/Button";

import { authTokenBridgeValue } from "../bridge/auth";

const rootElement = document.getElementById("root");

function App() {
  const token = authTokenBridgeValue.use();
  async function handleInvoke() {
    getFoo("foo").then((result) => {
      alert(result);
    });
  }

  function handleLogOut() {
    authTokenBridgeValue.set(null);
  }

  useEffect(() => {
    const cleanSending = createInterval(() => {
      const message = `ping - ${Math.random()}`;

      console.info("sending", message);
      pingPongChannel.send(message);
    }, 1000);

    const cleanListening = pingPongChannel.subscribe((response) => {
      console.info(`Got response - ${response}`);
    });

    return () => {
      cleanSending();
      cleanListening();
    };
  });
  return (
    <div>
      <Button kind="primary" onClick={handleInvoke}>
        Invoke test3
      </Button>
      <Button kind="primary">Button test</Button>
      Hello from react <TestView />
      <div>Token: {JSON.stringify(token)}</div>
      {!!token && (
        <Button kind="primary" onClick={handleLogOut}>
          Log out
        </Button>
      )}
    </div>
  );
}

render(<App />, rootElement);
