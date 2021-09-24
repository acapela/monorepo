import { ActionHandler } from "~backend/src/actions/actionHandlers";
import { findUserById } from "~backend/src/users/users";
import { Prisma, db } from "~db";
import { AcceptInvitationsOutput } from "~gql";
import { assert } from "~shared/assert";

export const acceptInvitations: ActionHandler<{ token: string }, AcceptInvitationsOutput> = {
  actionName: "accept_invitations",

  async handle(userId, { token }) {
    assert(userId, "missing userId");
    const user = await findUserById(userId);
    assert(user, "missing user");
    const userEmail = user.email;
    assert(userEmail, "missing email");

    const teamInvitation = await db.team_invitation.findFirst({
      where: { AND: { token, OR: [{ email: null }, { email: userEmail }] } },
    });
    if (!teamInvitation) {
      return { success: false };
    }

    const teamId = teamInvitation.team_id;
    const data: Pick<Prisma.team_invitationUncheckedUpdateManyInput, "used_at" | "used_by_user_id"> = {
      used_at: new Date(),
      used_by_user_id: user.id,
    };

    await db.$transaction([
      db.team_invitation.update({ where: { id: teamInvitation.id }, data }),
      db.task.updateMany({
        where: { team_invitation_id: teamInvitation.id },
        data: { team_invitation_id: null, user_id: user.id },
      }),

      db.room_invitation.updateMany({ where: { email: userEmail, team_id: teamInvitation.id }, data }),

      db.team_member.createMany({
        data: [{ team_id: teamId, user_id: user.id }],
        skipDuplicates: true,
      }),

      db.user.update({ where: { id: user.id }, data: { current_team_id: teamId } }),
    ]);

    return { success: true };
  },
};
