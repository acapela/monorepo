import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { PageMeta } from "~frontend/utils/PageMeta";
import { CurrentTeamInfoView } from "~frontend/views/CurrentTeam";

export default function TeamInfoPage(): JSX.Element {
  return (
    <>
      <PageMeta title="Team" />
      <CurrentTeamInfoView />
    </>
  );
}

assignPageLayout(TeamInfoPage, AppLayout);
