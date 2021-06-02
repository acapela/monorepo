import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { CurrentTeamInfoView } from "~frontend/views/CurrentTeam";

export default function TeamInfoPage(): JSX.Element {
  return <CurrentTeamInfoView />;
}

assignPageLayout(TeamInfoPage, AppLayout);
