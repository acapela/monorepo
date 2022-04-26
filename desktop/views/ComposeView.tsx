import { observer } from "mobx-react";
import React from "react";

import { goToMainScreen } from "@aca/desktop/actions/navigation";
import { Embed } from "@aca/desktop/domains/embed";
import { assertGetActiveRouteParams } from "@aca/desktop/routes";
import { SystemTopBar } from "@aca/desktop/ui/systemTopBar";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";

import { AppLayout } from "../layout/AppLayout";

export const ComposeView = observer(() => {
  const { url } = assertGetActiveRouteParams("compose");
  return (
    <AppLayout transparent>
      <SystemTopBar isFullWidth navigationItems={<TopBarActionButton action={goToMainScreen} />} />
      <Embed url={decodeURIComponent(url)} />
    </AppLayout>
  );
});
