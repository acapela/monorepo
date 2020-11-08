// import { gql, GraphQLClient } from "graphql-request";
// import { createRoom } from "../../src/rooms";

// import { getTestUserToken } from "./common";

describe("room", () => {
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
  
    it("can create a new room", async () => {
      const { id: userId } = await createUser({
        email: "test@example.com",
        firebaseId: "test-id-1",
        name: "test-user",
      });
      await createRoom({
        creatorId: userId,
        name: "test-room",
      });
      
  
      const query = gql`
        query {
          room {
            id
            creator_id
            name
            created_at
            deadline
          }
        }
      `;
  
      const results = await userClient.request(query);
      console.log(results);
    });
    */
});
