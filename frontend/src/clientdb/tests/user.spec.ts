import { createTestAppClientDbWithData } from "./testDB";

describe("clientdb user", () => {
  it("properly resolves current team", async () => {
    const [db, { currentUser, team }] = await createTestAppClientDbWithData();

    expect(currentUser.isMemberOfCurrentTeam).toBe(true);
    expect(team.isOwnedByCurrentUser).toBe(true);

    db.destroy();
  });
});
