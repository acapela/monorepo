import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect } from "react";
import { GoogleLoginButton, useCurrentUser } from "../src/authentication/authentication";
import { DEFAULT_REDIRECT_URL } from "../src/config";
import { Logo } from "../src/design/Logo";

export default function LoginPage(): JSX.Element {
  useRedirectWhenAuthenticated();

  return (
    <div>
      <Head>
        <title>Acapela</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-max-md mx-auto text-center mt-64">
        <div className="w-64 mx-auto mb-4">
          <Logo />
        </div>
        <GoogleLoginButton />
      </div>
    </div>
  );
}

function useRedirectWhenAuthenticated() {
  const { query, replace } = useRouter();
  const { loading, user } = useCurrentUser();
  const redirectUrl = readRedirectUrl(query);
  useEffect(() => {
    if (!loading && user) {
      replace(redirectUrl);
    }
  }, [redirectUrl, loading, user]);
}

function readRedirectUrl(query: ParsedUrlQuery): string {
  const redirectUrl = Array.isArray(query.redirectUrl) ? query.redirectUrl[0] : query.redirectUrl;

  return redirectUrl || DEFAULT_REDIRECT_URL;
}
