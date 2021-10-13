import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import { UserMenu } from "~frontend/layouts/UserMenu";
import { RouteLink, routes } from "~frontend/router";
import { Button } from "~ui/buttons/Button";
import { IconPlus } from "~ui/icons";
import { Shortcut } from "~ui/keyboard/Shortcut";
import { theme } from "~ui/theme";

import { RequestFeed } from "./RequestFeed";
import { RequestSearchResults } from "./RequestFeed/RequestSearchResults";

export const SidebarContent = observer(function SidebarContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isInSearchMode = searchTerm.trim().length > 0;

  return (
    <UIHolder>
      <UIHeader>
        <UserMenu />
        <RouteLink route={routes.newRequest} params={{}}>
          <a>
            <Button kind="secondary" size="small" icon={<IconPlus />} iconPosition="start">
              New Request
            </Button>
          </a>
        </RouteLink>
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
        {isInSearchMode && <RequestSearchResults searchTerm={searchTerm} />}
      </UIRequestFeed>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  width: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const UIHeader = styled.div<{}>`
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UIRequestFeed = styled.div<{}>`
  overflow-y: auto;
`;

const UISearch = styled.div<{}>`
  border-color: rgba(0, 0, 0, 0.05);
  border-style: solid;
  border-top-width: 1px;
  border-bottom-width: 1px;

  padding: 20px;

  ${theme.typo.content};

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const UISearchPlaceholder = styled.input<{}>`
  font: inherit;
  border: none;
  width: 100%;
  outline: none;
  background: transparent;
`;
