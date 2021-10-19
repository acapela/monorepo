import { FocusedActionLayout } from "~frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { InviteTeamMembersView } from "~frontend/views/InviteTeamMembersView/InviteTeamMembersView";

export default function PageInviteMembers() {
  return (
    <FocusedActionLayout title="Invite team members" description={<>Add your co-workers to track work together.</>}>
      <InviteTeamMembersView />
    </FocusedActionLayout>
  );
}
