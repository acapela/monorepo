import * as Sentry from "@sentry/react";
import React from "react";

import { FocusedActionView } from "@aca/desktop/views/FocusedActionView";

import { ErrorRecoveryButtons } from "./ErrorRecoveryButtons";

const ErrorRecoveryView = () => (
  <FocusedActionView title="App exception detected" description="Our engineering team has been notified">
    <ErrorRecoveryButtons />
  </FocusedActionView>
);

export const RootErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <Sentry.ErrorBoundary fallback={ErrorRecoveryView}>{children}</Sentry.ErrorBoundary>
);
