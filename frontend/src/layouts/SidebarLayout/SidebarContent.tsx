import { observer } from "mobx-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";

import { UserMenu } from "~frontend/layouts/UserMenu";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";
import { routes } from "~shared/routes";
import { Button } from "~ui/buttons/Button";
import { IconButton } from "~ui/buttons/IconButton";
import { IconCross, IconPlus } from "~ui/icons";
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
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

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

        <Link href={routes.newRequest}>
          <a>
            <Button kind="secondary" icon={<IconPlus />} iconAtStart>
              New Request
            </Button>
          </a>
        </Link>
      </UIHeader>

      <UISearch>
        <UISearchPlaceholder
          placeholder="Search by topic or person..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          ref={searchInputRef}
        ></UISearchPlaceholder>
        <Shortcut
          shortcut={["Mod", "/"]}
          callback={() => {
            searchInputRef.current?.focus();
          }}
        />
      </UISearch>

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
  border-color: rgba(0, 0, 0, 0.05);
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
