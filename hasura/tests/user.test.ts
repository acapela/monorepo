// import { gql, GraphQLClient } from "graphql-request";
// import { createUser } from "../../src/users";

// import { getTestUserToken } from "./common";

describe("user", () => {
  // TODO: test tokens don't yet work. Leaving this here as a placeholder.
  it("works", () => {});

  /*
  let userClient: GraphQLClient;

  beforeAll(async () => {
    const token = await getTestUserToken();
    userClient = new GraphQLClient("http://localhost:8080/v1/graphql", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  it("can only read its own data", async () => {
    await Promise.all([
      createUser({
        email: "test@example.com",
        firebaseId: "test-id-1",
        name: "test-user-1",
      }),
      createUser({
        email: "test2@example.com",
        firebaseId: "test-id-2",
        name: "test-user-2",
      }),
    ]);

    const query = gql`
      query {
        user {
          id
          email
          name
        }
      }
    `;

    const results = await userClient.request(query);
    console.log(results);
  });
  */
});
