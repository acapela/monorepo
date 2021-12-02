import { TeamEntity } from "../team";
import { TeamMemberEntity } from "../teamMember";
import { createTestAppClientDbWithData } from "./testDB";
import { makeUser } from "./utils";
import { ClientDb } from "..";

const now = new Date().toISOString();
describe("clientdb team", () => {
  let db: ClientDb;
  let team: TeamEntity;
  let userTeamMembership: TeamMemberEntity;

  beforeEach(async () => {
    const [_db, { team: _team, teamMembership }] = await createTestAppClientDbWithData();
    db = _db;
    team = _team;
    userTeamMembership = teamMembership;
  });

  afterEach(() => {
    db.destroy();
  });

  it("checks if has a slack installation", async () => {
    expect(team.hasSlackInstallation).toBeFalsy();

    await db.teamSlackInstallation.create({
      id: "slack",
      team_id: team.id,
      updated_at: now,
      scopes: [],
      __typename: "team_slack_installation",
    });

    expect(team.hasSlackInstallation).toBeTruthy();
  });

  it("checks if it is owned by current user", async () => {
    expect(team.isOwnedByCurrentUser).toBeTruthy();

    const newTeamOwner = await makeUser(db);
    team.update({ owner_id: newTeamOwner.id });

    expect(team.isOwnedByCurrentUser).toBeFalsy();
  });

  it("checks if current user has team as current", async () => {
    expect(team.isCurrentUserCurrentTeam).toBeTruthy();
  });

  it("gets team members", async () => {
    expect(team.memberships.all).toEqual([userTeamMembership]);
  });
});
