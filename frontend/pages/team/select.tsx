import { FocusedActionLayout } from "~frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { SelectTeamView } from "~frontend/views/SelectTeamView/SelectTeamView";

export default function TeamSelect() {
  return (
    <FocusedActionLayout title="Select or create team at Acapela" description="Teams allows you to work together">
      <SelectTeamView />
    </FocusedActionLayout>
  );
}
