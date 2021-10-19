import { FocusedActionLayout } from "~frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { CreateTeamView } from "~frontend/views/CreateTeamView/CreateTeamView";

export default function TeamCreate() {
  return (
    <FocusedActionLayout
      title="Create new team"
      description={<>Simplify decision making and gain focus time for your&nbsp;team</>}
    >
      <CreateTeamView />
    </FocusedActionLayout>
  );
}
