import styled, { css } from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { UserAvatar_UserFragment } from "~gql/generated";
import { theme } from "~ui/theme";

// TODO: Use Props
interface Props {
  selectedItemId: string;
  onItemSelect: string;
}

export function RequestFeed() {
  const feed = useRequestFeed();
  return (
    <UIHolder>
      {feed.map((section) => (
        <UISection key={section.key}>
          <UISectionTitle>{section.label}</UISectionTitle>
          {section.items.map((feedItem) => (
            <UIFeedItem isHighlighted={Math.random() > 0.5} key={feedItem.id}>
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

interface FeedItem {
  id: string;
  participants: UserAvatar_UserFragment[];
  title: string;
  subTitle: string;
  updateCount: number;
}

interface FeedSection {
  key: string;
  label: string;
  items: FeedItem[];
}

const useRequestFeed = function (): FeedSection[] {
  // This is a mock to make it work
  const currentUser = useAssertCurrentUser();

  return [
    {
      key: "requires-attention",
      label: "Requires attention",
      items: [
        {
          id: "000",
          title: "Dashboard redesign",
          participants: [currentUser],
          subTitle: "1 Hour Ago",
          updateCount: 0,
        },
        {
          id: "001",
          title: "Onboarding designs",
          participants: [currentUser],
          subTitle: "6 Hours left",
          updateCount: 0,
        },
      ],
    },
    {
      key: "new",
      label: "New",
      items: [
        {
          id: "002",
          title: "Investor updates",
          participants: [currentUser],
          subTitle: "We should send out a new investor updates to all the ones that supported us in the first round",
          updateCount: 1,
        },
      ],
    },
    {
      key: "open",
      label: "Open",
      items: [
        {
          id: "003",
          title: "Desktop App Launch",
          participants: [currentUser],
          subTitle: "I just deployed version 2.4.5 of our new MacOS app to be reviewed in the app store. Does anyone",
          updateCount: 0,
        },
        {
          id: "004",
          title: "Friday Drinks",
          participants: [currentUser],
          subTitle: "2 Days Left",
          updateCount: 0,
        },
      ],
    },
    {
      key: "closed",
      label: "Closed",
      items: [
        {
          id: "005",
          title: "Brand announcement",
          participants: [currentUser],
          subTitle: "I would like some feedback on the blogpost I made yesterday. I included last weeks's info",
          updateCount: 0,
        },
      ],
    },
  ];
};
