import React from "react";
import styled from "styled-components";

import { UserMenu } from "~frontend/layouts/AppLayout/UserMenu";
import { Button } from "~ui/buttons/Button";
import { IconPlus } from "~ui/icons";
import { theme } from "~ui/theme";

import { RequestFeed } from "./requestFeed/RequestFeed";

interface Props {
  selectedRequestId?: string;
}

export function SidebarContent({ selectedRequestId }: Props) {
  return (
    <UIHolder>
      <UIHeader>
        <UserMenu />
        <Button kind="secondary" size="small" icon={<IconPlus />} iconPosition="start">
          New Request
        </Button>
      </UIHeader>

      <UISearch>
        <UISearchPlaceholder>Search by topic or person...</UISearchPlaceholder>
        <UISearchShortcut>⌘/</UISearchShortcut>
      </UISearch>

      <UIRequestFeed>
        <RequestFeed selectedItemId={selectedRequestId} />
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
