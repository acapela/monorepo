import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { TopBarButton } from "@aca/desktop/ui/systemTopBar/TopBarButton";
import { IconListUnordered4 } from "@aca/ui/icons";
import { PopoverPanel } from "@aca/ui/popovers/PopoverPanel";
import { cachedComputed } from "@acapela/clientdb";

import { BatchResolver } from "./BatchResolver";

interface Props {
  list: NotificationsList;
}

const shouldShowResolveManyIndicator = cachedComputed((list: NotificationsList) => {
  return list.getCountIndicator() > 20;
});

export const BatchResolverButton = observer(({ list }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const notifications = list.getAllNotifications();

  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpened && notifications.length === 0) {
      setIsOpened(false);
    }
  }, [isOpened, !!notifications.length]);

  return (
    <>
      <AnimatePresence>
        {isOpened && (
          <PopoverPanel anchorRef={holderRef} enableScreenCover onCloseRequest={() => setIsOpened(false)}>
            <BatchResolver list={list} />
          </PopoverPanel>
        )}
      </AnimatePresence>

      <UIHolder ref={holderRef}>
        <TopBarButton
          icon={<IconListUnordered4 />}
          indicateNotification={shouldShowResolveManyIndicator(list)}
          tooltip="Resolve by..."
          onClick={() => {
            setIsOpened(true);
          }}
        />
      </UIHolder>
    </>
  );
});

const UIHolder = styled.div``;
