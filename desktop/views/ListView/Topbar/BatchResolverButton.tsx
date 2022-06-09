import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import { cachedComputed } from "@aca/clientdb";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { TopBarButton } from "@aca/desktop/ui/systemTopBar/TopBarButton";
import { IconListUnordered4 } from "@aca/ui/icons";
import { PopoverPanel } from "@aca/ui/popovers/PopoverPanel";

import { BatchResolver } from "./BatchResolver";

interface Props {
  list: NotificationsList;
}

const shouldShowResolveManyIndicator = cachedComputed((list: NotificationsList) => {
  return list.getCountIndicator() > 20;
});

export const BatchResolverButton = observer(({ list }: Props) => {
  const [isOpened, setIsOpened] = useState(false);

  const holderRef = useRef<HTMLDivElement>(null);

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
