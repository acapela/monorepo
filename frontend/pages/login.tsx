import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ParsedUrlQuery } from "querystring";

import { DEFAULT_REDIRECT_URL } from "@acapela/frontend/config";
import { UIContentWrapper } from "@acapela/frontend/design/UIContentWrapper";
import { UILogoWrapper } from "@acapela/frontend/design/UILogoWrapper";
import { Logo } from "@acapela/frontend/design/Logo";
import { GoogleLoginButton } from "@acapela/frontend/authentication/GoogleLoginButton";
import { EmailLoginButton } from "@acapela/frontend/authentication/EmailLoginButton";
import { useCurrentUser } from "@acapela/frontend/authentication/useCurrentUser";

export default function LoginPage(): JSX.Element {
  const { loading, isAuthenticated } = useRedirectWhenAuthenticated();

  return (
    <div>
      <Head>
        <title>Acapela</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UIContentWrapper marginTop>
        <UILogoWrapper>
          <Logo />
        </UILogoWrapper>
        {!isAuthenticated && (
          <>
            <GoogleLoginButton />
            &nbsp;
            <EmailLoginButton />
          </>
        )}
        {loading && <div>Loading...</div>}
      </UIContentWrapper>
    </div>
  );
}

function useRedirectWhenAuthenticated() {
  const { query, replace } = useRouter();
  const { loading, user } = useCurrentUser();
  const redirectUrl = readRedirectUrl(query);
  const [redirecting, setRedirecting] = useState(false);
  const isAuthenticated = !loading && user;

  useEffect(() => {
    if (isAuthenticated) {
      setRedirecting(true);
      replace(redirectUrl).then(() => setRedirecting(false));
    }
  }, [redirectUrl, isAuthenticated]);

  return { loading: loading || redirecting, isAuthenticated };
}

function readRedirectUrl(query: ParsedUrlQuery): string {
  const redirectUrl = Array.isArray(query.redirectUrl) ? query.redirectUrl[0] : query.redirectUrl;

  return redirectUrl || DEFAULT_REDIRECT_URL;
}
