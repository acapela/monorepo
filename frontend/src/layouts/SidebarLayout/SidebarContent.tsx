import { observer } from "mobx-react";
import React, { useState } from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { UserMenu } from "~frontend/layouts/UserMenu";
import { RouteLink, routes } from "~frontend/router";
import { Button } from "~ui/buttons/Button";
import { IconPlus } from "~ui/icons";
import { theme } from "~ui/theme";

import { RequestFeed } from "./RequestFeed";

interface Props {
  selectedTopicSlug?: string;
}

export const SidebarContent = observer(function SidebarContent({ selectedTopicSlug }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const db = useDb();

  console.log(db.topic.search(searchTerm));
  console.log(db.message.search(searchTerm));
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
        ></UISearchPlaceholder>
        <UISearchShortcut>⌘/</UISearchShortcut>
      </UISearch>

      <UIRequestFeed>
        <RequestFeed topicSlug={selectedTopicSlug} />
      </UIRequestFeed>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  width: 100%;
`;

const UIHeader = styled.div<{}>`
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UIRequestFeed = styled.div<{}>``;

const UISearch = styled.div<{}>`
  border-color: rgba(0, 0, 0, 0.05);
  border-style: solid;
  border-top-width: 1px;
  border-bottom-width: 1px;

  padding: 20px;

  ${theme.font.body12.withExceptionalSize("13px", "fitting new design").build()};
  color: ${theme.colors.layout.supportingText()};

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

const UISearchShortcut = styled.span<{}>``;
