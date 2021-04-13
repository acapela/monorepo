import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";
import { EmailLoginButton } from "~frontend/authentication/EmailLoginButton";
import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { DEFAULT_REDIRECT_URL } from "~frontend/config";
import { Logo } from "~frontend/design/Logo";
import { UIContentWrapper } from "~frontend/design/UIContentWrapper";
import { UILogoWrapper } from "~frontend/design/UILogoWrapper";

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
