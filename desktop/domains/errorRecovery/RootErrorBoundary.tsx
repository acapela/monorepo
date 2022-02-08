import React, { Component, ReactNode } from "react";

import { FocusedActionView } from "@aca/desktop/views/FocusedActionView";

import { ErrorRecoveryButtons } from "./ErrorRecoveryButtons";

interface State {
  error: unknown;
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
        <ErrorRecoveryButtons />
      </FocusedActionView>
    );
  }
}
