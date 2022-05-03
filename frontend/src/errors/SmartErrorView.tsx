import { getLocation } from "@swan-io/chicane";

import { ErrorView } from "@aca/frontend/src/views/ErrorView";
import { useDependencyChangeEffect } from "@aca/shared/hooks/useChangeEffect";

import { isKnownError } from "./knownErrors";

interface Props {
  error: unknown;
  resetError: () => void;
}

export function SmartErrorView({ error, resetError }: Props) {
  const { path } = getLocation();

  useDependencyChangeEffect(() => {
    resetError();
  }, [path]);

  if (isKnownError(error)) {
    return (
      <ErrorView title={error.message} description={error.info?.description}>
        {error.info?.renderActions?.()}
      </ErrorView>
    );
  }

  return <ErrorView title="It's not you, it's us!" description="An error occurred. We will look into it." />;
}
