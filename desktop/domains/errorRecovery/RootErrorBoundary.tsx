import * as Sentry from "@sentry/react";
import React from "react";

import { FocusedActionView } from "@aca/desktop/views/FocusedActionView";
import { Button } from "@aca/ui/buttons/Button";

import { ErrorRecoveryButtons } from "./ErrorRecoveryButtons";

interface RecoveryViewProps {
  reset: () => void;
}

const ErrorRecoveryView = ({ reset }: RecoveryViewProps) => {
  return (
    <FocusedActionView title="App exception detected" description="Our engineering team has been notified">
      <ErrorRecoveryButtons />
      <Button onClick={() => reset()} kind="transparent" size="compact">
        Retry
      </Button>
    </FocusedActionView>
  );
};

export const RootErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <Sentry.ErrorBoundary
    fallback={({ resetError }) => <ErrorRecoveryView reset={resetError} />}
    beforeCapture={(scope) => scope.setTag("severity", "crash")}
  >
    {children}
  </Sentry.ErrorBoundary>
);
