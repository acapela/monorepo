import { GetServerSideProps } from "next";

import { getUserSessionTokenFromRequest } from "~frontend/authentication/request";

/**
 * The goal of this page is only to redirect to desktop app passing auth token.
 */
export default function ReturnToApp() {
  return <></>;
}

/**
 * Auth token cookie is 'http-only' meaning there is no way to read it client side.
 *
 * This page will redirect user to proper, pass-auth link for desktop app. We prepare it server-side
 *
 * Note: technically this kills the whole point of 'http-only' cookie, as if someone knows this
 * route, they can inspect it being authorized and where are they redirected to, knowing the token.
 *
 * Possible safe solution (requiring bunch of custom work):
 * - when logging in for desktop, the flow is different
 * - if you successfully log in, instead of giving you auth token, we give one-time 'token' needed to get auth token
 * - we pass this 'one-time' token to desktop
 * - desktop asks server for auth token using this one-time token
 * - desktop app has auth token without it being exposed anymore for frontend
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = getUserSessionTokenFromRequest(context.req);

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: `/app/login`,
      },
    };
  }

  const desktopAuthLink = `acapela://authorize/${encodeURIComponent(token)}`;

  return {
    redirect: {
      permanent: false,
      destination: desktopAuthLink,
    },
  };
};
