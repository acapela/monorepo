import { useRouter } from "next/router";

import { ErrorView } from "~frontend/views/ErrorView";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";

import { isKnownError } from "./knownErrors";

interface Props {
  error: unknown;
  resetError: () => void;
}

export function SmartErrorView({ error, resetError }: Props) {
  const { pathname } = useRouter();

  useDependencyChangeEffect(() => {
    resetError();
  }, [pathname]);

  if (isKnownError(error)) {
    return (
      <ErrorView title={error.message} description={error.info?.description}>
        {error.info?.renderActions?.()}
      </ErrorView>
    );
  }

  return <ErrorView title="It's not you, it's us!" description="An error occurred. We will look into it." />;
}
