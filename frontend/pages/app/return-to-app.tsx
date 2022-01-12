import { GetServerSideProps } from "next";

import { getUserSessionTokenFromRequest } from "~frontend/authentication/request";

export default function ReturnToApp() {
  return <></>;
}

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
