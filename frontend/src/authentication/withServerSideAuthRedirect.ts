import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/client";

export function withServerSideAuthRedirect<P>(
  propsFactory?: (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<P>>
) {
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

    const result = await propsFactory?.(context);

    if (!result) {
      return { props: {} as P };
    }

    return result;
  };
}
