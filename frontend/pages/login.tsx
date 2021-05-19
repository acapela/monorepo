import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";
import { EmailLoginButton } from "~frontend/authentication/EmailLoginButton";
import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { DEFAULT_REDIRECT_URL } from "~frontend/config";
import { Logo } from "~frontend/ui/Logo";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { UILogoWrapper } from "~frontend/ui/UILogoWrapper";
import { LoginOptionsView } from "~frontend/views/LoginOptionsView";

export default function LoginPage(): JSX.Element {
  const { isRedirecting, isAuthenticated } = useRedirectWhenAuthenticated();

  return (
    <div>
      <UIContentWrapper marginTop>
        <UILogoWrapper>
          <Logo />
        </UILogoWrapper>
        {!isAuthenticated && <LoginOptionsView />}
        {isRedirecting && <div>Redirecting...</div>}
      </UIContentWrapper>
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
