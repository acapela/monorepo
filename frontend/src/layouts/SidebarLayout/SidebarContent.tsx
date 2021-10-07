import React from "react";
import styled from "styled-components";

import { RouteLink, routes } from "~frontend/../router";
import { UserMenu } from "~frontend/layouts/UserMenu";
import { Button } from "~ui/buttons/Button";
import { IconPlus } from "~ui/icons";
import { theme } from "~ui/theme";

import { RequestFeed } from "./RequestFeed";

interface Props {
  selectedTopicSlug?: string;
}

export function SidebarContent({ selectedTopicSlug }: Props) {
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
        <UISearchPlaceholder>Search by topic or person...</UISearchPlaceholder>
        <UISearchShortcut>⌘/</UISearchShortcut>
      </UISearch>

      <UIRequestFeed>
        <RequestFeed topicSlug={selectedTopicSlug} />
      </UIRequestFeed>
    </UIHolder>
  );
}

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

const UISearchPlaceholder = styled.span<{}>``;

const UISearchShortcut = styled.span<{}>``;
