import React, { Component, ReactNode } from "react";
import styled from "styled-components";

import { clearAllDataRequest, restartAppRequest } from "@aca/desktop/bridge/system";
import { FocusedActionView } from "@aca/desktop/views/FocusedActionView";
import { Button } from "@aca/ui/buttons/Button";

interface State {
  error: unknown;
}

async function tryRestart() {
  try {
    await restartAppRequest();
  } catch (error) {
    window.location.reload();
  }
}

async function tryLogout() {
  await clearAllDataRequest();
}

export class RootErrorBoundary extends Component<{}, State> {
  state: State = { error: null };
  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  render(): ReactNode {
    if (!this.state.error) {
      return <>{this.props.children}</>;
    }

    return (
      <FocusedActionView title="App exception detected" description="Our engineering team has been notified">
        <UIButtonsSet>
          <Button kind="primary" onClick={tryRestart}>
            Restart App
          </Button>
          <Button onClick={tryLogout}>Log in again</Button>
        </UIButtonsSet>
      </FocusedActionView>
    );
  }
}

const UIButtonsSet = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;

  ${Button} {
    flex-grow: 1;
  }
`;
