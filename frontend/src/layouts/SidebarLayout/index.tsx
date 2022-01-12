import { observer } from "mobx-react";
import router from "next/router";
import React, { ReactNode, useEffect } from "react";
import styled, { css } from "styled-components";

import { LoadingScreen } from "@aca/frontend/clientdb/LoadingScreen";
import { NewTopicModalDisplayer } from "@aca/frontend/topics/NewTopicModalDisplayer";
import { HorizontalSpacingContainer } from "@aca/frontend/ui/layout";
import { useWindowEvent } from "@aca/shared/domEvents";
import { useBoolean } from "@aca/shared/hooks/useBoolean";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconMenu } from "@aca/ui/icons";
import { phone } from "@aca/ui/responsive";
import { theme } from "@aca/ui/theme";

import { SidebarContent } from "./SidebarContent";
import { useAppInitBatchProcedures } from "./useAppInit";
import { useAppRedirects } from "./useAppRedirects";

interface Props {
  children?: ReactNode;
}

export const SidebarLayout = observer(({ children }: Props) => {
  const [mobileIsOpened, { toggle: toggleMobileIsOpened, unset: closeMobileMenu }] = useBoolean(false);

  useEffect(() => {
    // We dont want useRouter as it would re-render component on each router change, but we dont need it inside render in any way
    router.events.on("routeChangeComplete", closeMobileMenu);

    return () => {
      router.events.off("routeChangeComplete", closeMobileMenu);
    };
  }, [closeMobileMenu]);

  const willRedirect = useAppRedirects();

  useAppInitBatchProcedures({ skip: willRedirect });

  // Close mobile menu if user rotates the screen
  useWindowEvent("orientationchange", closeMobileMenu);

  if (willRedirect) {
    return <LoadingScreen loadingNotice="Setting up Acapela..." />;
  }

  return (
    <UIHolder>
      <NewTopicModalDisplayer />
      <UISidebar mobileIsOpened={mobileIsOpened}>
        <SidebarContent onMobileCloseRequest={closeMobileMenu} />
      </UISidebar>
      <UIMainContent
        mobileIsOpened={mobileIsOpened}
        onClick={() => {
          if (mobileIsOpened) {
            closeMobileMenu();
          }
        }}
      >
        <UIPhoneToggle>
          <IconButton kind="backgroundAccent" icon={<IconMenu />} onClick={toggleMobileIsOpened} />
        </UIPhoneToggle>
        <UIMainContentBody>{children}</UIMainContentBody>
      </UIMainContent>
    </UIHolder>
  );
});

const UISidebar = styled.div<{ mobileIsOpened: boolean }>`
  height: 100vh;
  max-height: 100vh;
  ${theme.colors.layout.backgroundAccent.asBg};

  box-sizing: border-box;
  flex-shrink: 0;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  ${(props) => {
    const { mobileIsOpened } = props;
    return phone(css`
      transition: 0.2s all;
      transform: translateX(${mobileIsOpened ? 0 : -100}%);
    `);
  }}

  ${phone(
    css`
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
    `
  )}
`;

const UIHolder = styled.div<{}>`
  display: flex;
  min-height: 100vh;

  ${phone(
    css`
      flex-direction: column;
    `
  )}
`;

const UIMainContent = styled.div<{ mobileIsOpened: boolean }>`
  flex-grow: 1;
  min-width: 0;
  max-height: 100vh;
  ${theme.colors.layout.background.asBg};
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  transition: 0.2s all;

  ${(props) => {
    if (props.mobileIsOpened)
      return css`
        opacity: 0.5;
        & * {
          pointer-events: none;
        }
      `;
  }}
`;

const UIMainContentBody = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const UIPhoneToggle = styled(HorizontalSpacingContainer)`
  align-self: stretch;
  padding-top: 20px;
  display: none;

  ${phone(
    css`
      display: block;
    `
  )}
`;
