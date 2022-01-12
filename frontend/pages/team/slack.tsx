import { FocusedActionLayout } from "@aca/frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { ConnectTeamWithSlackView } from "@aca/frontend/views/ConnectTeamWithSlackView/ConnectTeamWithSlackView";

export default function TeamSlack() {
  return (
    <FocusedActionLayout
      title="Connect team with Slack"
      description={<>Track and create all team tasks directly in Slack</>}
    >
      <ConnectTeamWithSlackView />
    </FocusedActionLayout>
  );
}
