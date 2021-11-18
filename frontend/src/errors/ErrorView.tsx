import { useRouter } from "next/router";

import { PlainErrorView } from "~frontend/views/ErrorView";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";

import { isCommonError } from "./commonErrors";

interface Props {
  error: unknown;
  resetError: () => void;
}

export function ErrorView({ error, resetError }: Props) {
  const { pathname } = useRouter();

  useDependencyChangeEffect(() => {
    resetError();
  }, [pathname]);

  if (isCommonError(error)) {
    return (
      <PlainErrorView title={error.message} description={error.info?.description}>
        {error.info?.renderActions?.()}
      </PlainErrorView>
    );
  }

  return <PlainErrorView title="It's not you, it's us!" description="An error occurred. We will look into it." />;
}
