import { signOut } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";
import { EmailLoginButton } from "~frontend/authentication/EmailLoginButton";
import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { Logo } from "~frontend/design/Logo";
import { UIContentWrapper } from "~frontend/design/UIContentWrapper";
import { UILogoWrapper } from "~frontend/design/UILogoWrapper";

const AppLinkWrapper = styled.div``;

export default function LandingPage(): JSX.Element {
  const { user } = useCurrentUser();

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
        {user ? (
          <>
            <AppLinkWrapper>
              <Link href="/home">Return to the app</Link>
            </AppLinkWrapper>
            <a href="" onClick={() => signOut()}>
              Logout
            </a>
          </>
        ) : (
          <>
            <GoogleLoginButton />
            &nbsp;
            <EmailLoginButton />
          </>
        )}
      </UIContentWrapper>
    </div>
  );
}
