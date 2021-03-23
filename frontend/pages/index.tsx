import Head from "next/head";
import Link from "next/link";
import { GoogleLoginButton, EmailLoginButton, useCurrentUser } from "@acapela/frontend/authentication/authentication";
import { Logo } from "@acapela/frontend/design/Logo";
import { signOut } from "next-auth/client";

export default function LandingPage(): JSX.Element {
  const { user } = useCurrentUser();

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
        <div>{user && <Link href="/home">Return to app</Link>}</div>
        {user && (
          <div
            onClick={() => {
              signOut();
            }}
          >
            Logout
          </div>
        )}
        <GoogleLoginButton />
        &nbsp;
        <EmailLoginButton />
      </div>
    </div>
  );
}
