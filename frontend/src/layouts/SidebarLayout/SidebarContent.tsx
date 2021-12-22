import { action } from "mobx";
import { observer } from "mobx-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";

import { useAppStateStore } from "~frontend/appState/AppStateStore";
import { UserMenu } from "~frontend/layouts/UserMenu";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";
import { routes } from "~shared/routes";
import { Button } from "~ui/buttons/Button";
import { IconButton } from "~ui/buttons/IconButton";
import { IconCross, IconInboxIn, IconPlus } from "~ui/icons";
import { Shortcut } from "~ui/keyboard/Shortcut";
import { phone } from "~ui/responsive";
import { theme } from "~ui/theme";

import { RequestFeed } from "./RequestFeed";
import { RequestSearchResults } from "./RequestFeed/RequestSearchResults";

const DEBOUNCE_SEARCH = true;

interface Props {
  onMobileCloseRequest: () => void;
}

export const SidebarContent = observer(function SidebarContent({ onMobileCloseRequest }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const appState = useAppStateStore();

  const debouncedSearchTerm = useDebouncedValue(searchTerm, { timeFactory: () => 30 });
  const finalSearchTerm = DEBOUNCE_SEARCH ? debouncedSearchTerm : searchTerm;
  const isInSearchMode = finalSearchTerm.trim().length > 0;

  return (
    <UIHolder>
      <UIHeader>
        <IconButton icon={<IconCross />} onClick={onMobileCloseRequest} />
        <UIHeaderUser>
          <UserMenu />
        </UIHeaderUser>

        <Button
          kind="secondary"
          icon={<IconPlus />}
          onClick={action(() => (appState.creatingNewTopic = { enabled: true }))}
        >
          New Request
        </Button>
      </UIHeader>

      <UISearch>
        <UISearchPlaceholder
          placeholder="Search by topic or person..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          ref={searchInputRef}
        />
        <Shortcut
          shortcut={["Mod", "/"]}
          callback={() => {
            searchInputRef.current?.focus();
          }}
        />
      </UISearch>

      <Link href={routes.home}>
        <UISidebarNavItem $isActive={router.pathname == routes.home}>
          <IconInboxIn style={{ width: 20, height: 20 }} /> Inbox
        </UISidebarNavItem>
      </Link>

      <UIRequestFeed>
        {!isInSearchMode && <RequestFeed />}
        {isInSearchMode && <RequestSearchResults searchTerm={finalSearchTerm} />}
      </UIRequestFeed>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  width: 100%;
  height: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const primaryPaddingInSidebar = css`
  padding: 20px;
  ${phone(
    css`
      padding: 15px;
    `
  )}
`;

const UIHeader = styled.div<{}>`
  ${primaryPaddingInSidebar}
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.actions.asGap}

  ${IconButton} {
    display: none;
    ${phone(
      css`
        display: block;
      `
    )}
  }
`;

const UIHeaderUser = styled.div`
  flex-grow: 1;
  display: flex;
`;

const UIRequestFeed = styled.div<{}>`
  overflow-y: auto;
  height: 100%;
`;

const UISearch = styled.div<{}>`
  border-color: ${theme.colors.layout.background.border};
  border-style: solid;
  border-top-width: 1px;
  border-bottom-width: 1px;

  ${primaryPaddingInSidebar}

  ${theme.typo.content};

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UISearchPlaceholder = styled.input<{}>`
  font: inherit;
  border: none;
  width: 100%;
  outline: none;
  background: transparent;
`;

const UISidebarNavItem = styled.div<{ $isActive: boolean }>`
  padding: 15px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.actions.asGap};
  ${theme.typo.content.semibold};
  cursor: pointer;

  ${(props) =>
    props.$isActive &&
    css`
      ${theme.colors.layout.backgroundAccent.active.asBg};
    `}

  &:hover {
    ${theme.colors.layout.backgroundAccent.hover.asBg};
  }
`;
