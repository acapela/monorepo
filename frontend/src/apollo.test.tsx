import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { gql } from "@apollo/client";
import { graphql, rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "next-auth/client";
import { GoogleLoginButton, useCurrentUser } from "./authentication/authentication";
import { Provider as ApolloProvider } from "./apollo";
import { useGetRoomsQuery } from "./gql";

jest.mock(
  "next-auth/client",
  () => {
    return {
      Provider({ children }) {
        return <>{children}</>;
      },
      useSession() {
        return [{}, false];
      },
      signIn(method: string) {
        //
      },
    };
  },
  { virtual: true }
);

const mockBackend = setupServer(
  graphql.query("GetRooms", (_, res, ctx) => res(ctx.data({ room: [{ id: "test-room-id" }] }))),
  rest.post("/api/backend/v1/users", (_, res, ctx) => res(ctx.json({ id: "testUserId" }))),
  rest.get("/api/auth/session", (req, res, ctx) => {
    return res(ctx.json({ id: "foo" }));
  })
);

describe("Apollo setup", () => {
  beforeAll(() => mockBackend.listen({ onUnhandledRequest: "warn" }));
  afterAll(() => mockBackend.close());
  // TODO: this test is currently failing because the TestQueryComponent
  // receives an empty room list from the useGetRoomsQuery() function
  it.skip("sets up graphql link correctly when you are authenticated", async () => {
    render(
      <Provider session={null}>
        <ApolloProvider>
          <TestComponent />
          <GoogleLoginButton />
        </ApolloProvider>
      </Provider>
    );
    expect(screen.queryByText("test-room-id")).not.toBeInTheDocument();
    login();
    await waitFor(() => {
      expect(screen.getByText("test-room-id")).toBeInTheDocument();
    });
  });
});

gql`
  query GetRoomsTestQuery {
    room {
      id
    }
  }
`;

function TestComponent() {
  const { user, loading } = useCurrentUser();
  if (user) {
    return <TestQueryComponent />;
  }
  return <></>;
}

function TestQueryComponent() {
  const { data } = useGetRoomsQuery();
  return <>Rooms: {data ? data.room.map((room) => <li key={room.id}>{room.id}</li>) : "Loading"}</>;
}

function login() {
  act(() => {
    fireEvent.click(screen.getByText("Log in with Google"));
  });
}
