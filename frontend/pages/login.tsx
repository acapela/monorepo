import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { DEFAULT_REDIRECT_URL } from "~frontend/config";
import { LoginOptionsView } from "~frontend/views/LoginOptionsView";
import { WindowView } from "~frontend/views/WindowView";

export default function LoginPage(): JSX.Element {
  const { isRedirecting, isAuthenticated } = useRedirectWhenAuthenticated();
  const { query } = useRouter();
  const isEmailLoginEnabled = query.isEmailLoginEnabled === "true";

  return (
    <div>
      <WindowView>
        {!isAuthenticated && <LoginOptionsView isEmailLoginEnabled={isEmailLoginEnabled} />}
        {isRedirecting && <div>Redirecting...</div>}
      </WindowView>
    </div>
  );
}

function useRedirectWhenAuthenticated() {
  const { query, replace } = useRouter();
  const user = useCurrentUser();
  const redirectUrl = readRedirectUrl(query);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isAuthenticated) {
      setIsRedirecting(true);
      replace(redirectUrl).then(() => setIsRedirecting(false));
    }
  }, [redirectUrl, isAuthenticated]);

  return { isRedirecting, isAuthenticated };
}

function readRedirectUrl(query: ParsedUrlQuery): string {
  const redirectUrl = Array.isArray(query.redirectUrl) ? query.redirectUrl[0] : query.redirectUrl;

  return redirectUrl || DEFAULT_REDIRECT_URL;
}
