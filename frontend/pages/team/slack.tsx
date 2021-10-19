import { FocusedActionLayout } from "~frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { ConnectTeamWithSlackView } from "~frontend/views/ConnectTeamWithSlackView/ConnectTeamWithSlackView";

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
