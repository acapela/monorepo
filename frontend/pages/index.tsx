import { useSession } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";
import { GoogleLoginButton, useCurrentUser } from "../src/authentication/authentication";
import { Logo } from "../src/design/Logo";

export default function LandingPage() {
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

        <GoogleLoginButton />
      </div>
    </div>
  );
}
