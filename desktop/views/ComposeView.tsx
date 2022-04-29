import { observer } from "mobx-react";
import React from "react";

import { exitComposeMode } from "@aca/desktop/actions/compose";
import { Embed } from "@aca/desktop/domains/embed";
import { getRouteParamsIfActive } from "@aca/desktop/routes";
import { SystemTopBar } from "@aca/desktop/ui/systemTopBar";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";

import { AppLayout } from "../layout/AppLayout";

export const ComposeView = observer(() => {
  const params = getRouteParamsIfActive("compose");
  if (!params) {
    return null;
  }
  const { url } = params;
  return (
    <AppLayout transparent>
      <SystemTopBar isFullWidth navigationItems={<TopBarActionButton action={exitComposeMode} />} />
      <Embed url={decodeURIComponent(url)} />
    </AppLayout>
  );
});
