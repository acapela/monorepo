import { TeamMemberEntity } from "../teamMember";
import { UserEntity } from "../user";
import { createTestAppClientDbWithData } from "./testDB";
import { ClientDb } from "..";

describe("clientdb team member", () => {
  let db: ClientDb;

  let currentUser: UserEntity;
  let teamMember: TeamMemberEntity;

  beforeEach(async () => {
    const [_db, { teamMembership, currentUser: _currentUser }] = await createTestAppClientDbWithData();
    db = _db;

    teamMember = teamMembership;
    currentUser = _currentUser;
  });

  afterEach(() => {
    db.destroy();
  });

  it("gets user", () => {
    expect(teamMember.user).toBe(currentUser);
  });

  it("gets the team member slack", async () => {
    expect(teamMember.teamMemberSlack).toBeNull();

    const teamMemberSlack = await db.teamMemberSlack.create({
      slack_scopes: "scopes",
      slack_user_id: "slack-user-id",
      team_member_id: teamMember.id,
    });

    expect(teamMember.teamMemberSlack).toBe(teamMemberSlack);
  });

  it("checks if current user is member of current team", () => {
    expect(teamMember.isMemberOfCurrentTeam).toBeTruthy();
  });
});
