// This type is not nicely exported. As we use import type - it has no runtime artifacts so seems to be safe
import type { FallbackRender } from "@sentry/react/dist/errorboundary";

import { SmartErrorView } from "./SmartErrorView";

export const sentryFallbackErrorRenderer: FallbackRender = (errorData) => {
  const { error, resetError } = errorData;

  return <SmartErrorView error={error} resetError={resetError} />;
};
