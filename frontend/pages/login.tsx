import { ParsedUrlQuery } from "querystring";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { FocusedActionLayout } from "~frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { PageMeta } from "~frontend/utils/PageMeta";
import { LoginOptionsView } from "~frontend/views/LoginOptionsView";

export default function LoginPage(): JSX.Element {
  const { isRedirecting, isAuthenticated } = useRedirectWhenAuthenticated();

  return (
    <>
      <PageMeta title="Login" />
      <FocusedActionLayout title="Log in to start using Acapela">
        {!isAuthenticated && <LoginOptionsView />}
        {isRedirecting && <div>Redirecting...</div>}
      </FocusedActionLayout>
    </>
  );
}

function useRedirectWhenAuthenticated() {
  const { query, replace } = useRouter();
  const user = useCurrentUserTokenData();
  const redirectUrl = readRedirectUrl(query);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isAuthenticated) {
      setIsRedirecting(true);
      replace(redirectUrl).then(() => setIsRedirecting(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectUrl, isAuthenticated]);

  return { isRedirecting, isAuthenticated };
}

function readRedirectUrl(query: ParsedUrlQuery): string {
  const redirectUrl = Array.isArray(query.redirectUrl) ? query.redirectUrl[0] : query.redirectUrl;

  return redirectUrl || "/";
}
