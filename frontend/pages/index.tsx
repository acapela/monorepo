import { GetServerSideProps } from "next";
import Head from "next/head";
import { getUserFromAppContext } from "~frontend/authentication/appContext";
import { EmailLoginButton } from "~frontend/authentication/EmailLoginButton";
import { GoogleLoginButton } from "~frontend/authentication/GoogleLoginButton";
import { Logo } from "~frontend/design/Logo";
import { UIContentWrapper } from "~frontend/design/UIContentWrapper";
import { UILogoWrapper } from "~frontend/design/UILogoWrapper";

export default function LandingPage(): JSX.Element {
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
        <GoogleLoginButton />
        &nbsp;
        <EmailLoginButton />
      </UIContentWrapper>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = getUserFromAppContext(context.req);

  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
