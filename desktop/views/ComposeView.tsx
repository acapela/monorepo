import { observer } from "mobx-react";
import React, { useLayoutEffect } from "react";

import { exitComposeMode } from "@aca/desktop/actions/compose";
import { Embed } from "@aca/desktop/domains/embed";
import { getRouteParamsIfActive } from "@aca/desktop/routes";
import { SystemTopBar } from "@aca/desktop/ui/systemTopBar";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";

import { animationStore } from "../domains/embed/animationStore";
import { AppLayout } from "../layout/AppLayout";

export const ComposeView = observer(() => {
  const params = getRouteParamsIfActive("compose");

  useLayoutEffect(() => {
    animationStore.upcomingEmbedAnimation = "swipe-left";
    return () => {
      animationStore.upcomingEmbedAnimation = "swipe-right";
    };
  }, []);

  if (!params) {
    return null;
  }
  const { url } = params;

  return (
    <AppLayout transparent>
      <SystemTopBar isFullWidth titleNode="Compose" navigationItems={<TopBarActionButton action={exitComposeMode} />} />
      <Embed url={decodeURIComponent(url)} />
    </AppLayout>
  );
});
