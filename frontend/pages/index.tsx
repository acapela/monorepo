import styled from "styled-components";
import Head from "next/head";
import Link from "next/link";
import { EmailLoginButton, GoogleLoginButton, useCurrentUser } from "@acapela/frontend/authentication/authentication";
import { UIContentWrapper } from "@acapela/frontend/design/UIContentWrapper";
import { Logo } from "@acapela/frontend/design/Logo";
import { signOut } from "next-auth/client";

const UILogoWrapper = styled.div`
  width: 16rem;
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
`;

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
