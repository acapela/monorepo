import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/client";

export function withServerSideAuthRedirect<P>(propsFactory?: (context: GetServerSidePropsContext) => Promise<P>) {
  return async function (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> {
    const session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const props = await propsFactory?.(context);

    if (!props) {
      return { props: {} as P };
    }

    return { props };
  };
}
