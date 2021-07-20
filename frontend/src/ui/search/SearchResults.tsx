import Link from "next/link";
import styled, { css } from "styled-components";
import { HIGHLIGHT_COLOR, PRIMARY_PINK_1 } from "~ui/colors";
import { SearchResultFragment } from "~gql";
import { borderRadius } from "~ui/baseStyles";
import { zIndex } from "~ui/zIndex";
import { useListWithNavigation } from "~shared/hooks/useListWithNavigation";
import { setColorOpacity } from "~shared/colors";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { POP_PRESENCE_STYLES } from "~ui/animations";

interface Props {
  className?: string;
  searchTerm: string;
  results: SearchResultFragment[];
}

function composeTopicLink({ room, topicId }: SearchResultFragment): string {
  return `/space/${room?.space?.id}/${room?.id}/${topicId}`;
}

function composeResultBreadcrumb({ room, topicName }: SearchResultFragment): string {
  const spaceName = room?.space?.name;
  const roomName = room?.name;

  return `${spaceName}/${roomName}/${topicName}`;
}

function renderResultMatchString(result: SearchResultFragment, searchTerm: string) {
  const searchTermToMatch = searchTerm.toLowerCase();

  const matchIndicesMap = new Map([
    [result.messageContent, result.messageContent?.toLowerCase().indexOf(searchTermToMatch) ?? -1],
    [result.topicName, result.topicName?.toLowerCase().indexOf(searchTermToMatch) ?? -1],
    [result.attachmentName, result.attachmentName?.toLowerCase().indexOf(searchTermToMatch) ?? -1],
    [result.transcript, result.transcript?.toLowerCase().indexOf(searchTermToMatch) ?? -1],
  ]);

  for (const [prop, index] of matchIndicesMap.entries()) {
    if (index > -1) {
      return (
        <>
          {prop?.substring(Math.max(0, index - 20), index)}
          <UISearchResultMatchHighlight>
            {prop?.substring(index, index + searchTerm.length)}
          </UISearchResultMatchHighlight>
          {prop?.substring(index + searchTerm.length, index + 10)}
        </>
      );
    }
  }
}

// TODO: Attempt to use ItemsDropdown when we have a clearer idea of where search is going to move
const PureSearchResults = ({ className, searchTerm, results }: Props) => {
  const { activeItem: highlightedItem, setActiveItem: setHighlightedItem } = useListWithNavigation(results, {
    enableKeyboard: true,
  });

  return (
    <ul className={className}>
      <PresenceAnimator presenceStyles={POP_PRESENCE_STYLES}>
        {!results.length && <UINoResults>No results</UINoResults>}
        {results.map((result, idx) => (
          <UISearchResultRow key={idx}>
            <Link href={composeTopicLink(result)} passHref>
              <UISearchResultLink
                onMouseEnter={() => setHighlightedItem(result)}
                isHighlighted={result === highlightedItem}
              >
                <UISearchResultMatch>{renderResultMatchString(result, searchTerm)}</UISearchResultMatch>
                <UISearchResultBreadcrumb>{composeResultBreadcrumb(result)}</UISearchResultBreadcrumb>
              </UISearchResultLink>
            </Link>
          </UISearchResultRow>
        ))}
      </PresenceAnimator>
    </ul>
  );
};

export const SearchResults = styled(PureSearchResults)`
  padding: 16px 16px;
  background-color: #fff;
  border: 1px solid rgba(190, 190, 190, 0.25);
  z-index: ${zIndex.Popover};
  ${borderRadius.modal}
`;

const UINoResults = styled.span``;

const UISearchResultRow = styled.li`
  & ~ & {
    margin-top: 4px;
  }
`;

const UISearchResultLink = styled.a<{ isHighlighted: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 1.5;
  padding: 4px 8px;
  border: 1px solid transparent;

  ${borderRadius.item}

  &:hover {
    background-color: ${setColorOpacity(PRIMARY_PINK_1, 0.05)};
  }

  svg {
    color: ${PRIMARY_PINK_1};
  }

  ${(props) =>
    props.isHighlighted &&
    css`
      border: 1px solid ${PRIMARY_PINK_1};
      background-color: ${setColorOpacity(PRIMARY_PINK_1, 0.05)};
    `}
`;

const UISearchResultMatch = styled.span``;

const UISearchResultMatchHighlight = styled.span`
  background-color: ${HIGHLIGHT_COLOR};
`;

const UISearchResultBreadcrumb = styled.span`
  flex-shrink: 0;
`;
