import { ApolloClient } from "@apollo/client";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { readTokenFromRequest, getApolloClient } from "./client";

export function withApolloClient<P>(
  propsFactory?: (
    context: GetServerSidePropsContext,
    client: ApolloClient<unknown>
  ) => Promise<GetServerSidePropsResult<P>>
) {
  return async function (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> {
    const authToken = readTokenFromRequest(context.req);
    const hasuraWebsocketEndpoint = process.env.HASURA_WEBSOCKET_ENDPOINT;

    const client = getApolloClient({
      forcedAuthToken: authToken ?? undefined,
      websocketEndpoint: hasuraWebsocketEndpoint ?? undefined,
    });

    const result = await propsFactory?.(context, client);

    if (!result) {
      return { props: {} as P };
    }

    return result;
  };
}
