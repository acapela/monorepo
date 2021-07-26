import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";

import { PageMeta } from "~frontend/utils/PageMeta";
import { TeamMembersView } from "~frontend/views/TeamMembersView";

export default function TeamInfoPage(): JSX.Element {
  return (
    <>
      <PageMeta title="Team" />
      <TeamMembersView />
    </>
  );
}

assignPageLayout(TeamInfoPage, AppLayout);
