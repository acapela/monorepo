import styled, { css } from "styled-components";

import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { theme } from "~ui/theme";

import { useRequestFeed } from "./useRequestFeed";

interface Props {
  selectedItemId?: string;
}

export function RequestFeed({ selectedItemId }: Props) {
  const feed = useRequestFeed();
  return (
    <UIHolder>
      {feed.map((section) => (
        <UISection key={section.key}>
          <UISectionTitle>{section.label}</UISectionTitle>
          {section.items.map((feedItem) => (
            <UIFeedItem isHighlighted={feedItem.id === selectedItemId} key={feedItem.id}>
              <UserAvatar user={feedItem.participants[0]} />
              <UIFeedItemLabels>
                <UIFeedItemTitle>{feedItem.title}</UIFeedItemTitle>
                <UIFeedItemSubTitle>{feedItem.subTitle}</UIFeedItemSubTitle>
              </UIFeedItemLabels>
            </UIFeedItem>
          ))}
        </UISection>
      ))}
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  overflow-x: hidden;
`;

const UISection = styled.div<{}>`
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 8px;
`;

const UISectionTitle = styled.div<{}>`
  padding-left: 10px;
  ${theme.font.withExceptionalSize("11px", "New sizing").build()}
  opacity: 0.6;
`;

const UIFeedItem = styled.div<{ isHighlighted?: boolean }>`
  width: 100%;

  height: 60px;
  padding: 10px;
  border-radius: 8px;

  display: grid;
  grid-template-columns: 40px 1fr;

  align-items: center;

  ${(props) =>
    props.isHighlighted &&
    css`
      &&& {
        /* TODO: Move to theme */
        background-color: #ff57e3;
        color: ${theme.colors.layout.foreground()};
      }
    `}
`;

const UIFeedItemLabels = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const UIFeedItemTitle = styled.h6<{ isSelected?: boolean }>`
  ${(props) => (props.isSelected ? theme.font.h6.medium.build() : theme.font.h6.build())}
`;

const UIFeedItemSubTitle = styled.div<{}>`
  ${theme.font.withExceptionalSize("11px", "New sizing").build()}

  opacity: 0.6;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
`;
