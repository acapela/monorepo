import Link from "next/link";
import styled, { css } from "styled-components";

import { routes } from "~frontend/router";
import { SearchResultsQuery } from "~gql";
import { assert } from "~shared/assert";
import { useListWithNavigation } from "~shared/hooks/useListWithNavigation";
import { PopPresenceAnimator } from "~ui/animations";
import { borderRadius } from "~ui/baseStyles";
import { BASE_GREY_5, PRIMARY_PINK_1, PRIMARY_PINK_1_TRANSPARENT } from "~ui/theme/colors/base";
import { zIndex } from "~ui/zIndex";

interface Props {
  className?: string;
  term: string;
  results: SearchResultsQuery;
}

type ResultItem = (
  | SearchResultsQuery["spaces"]
  | SearchResultsQuery["rooms"]
  | SearchResultsQuery["topics"]
  | SearchResultsQuery["messages"]
)[0];

function assertTypename(typename: ResultItem["__typename"]): asserts typename {
  assert(typename, "__typename should always be set by apollo");
}

function getItemURL(result: ResultItem): string {
  assertTypename(result.__typename);
  switch (result.__typename) {
    case "space":
      return routes.space.getUrlWithParams({ spaceId: result.id });

    case "room":
      return routes.spaceRoom.getUrlWithParams({ spaceId: result.space.id, roomId: result.id });

    case "topic": {
      const { room } = result;
      return routes.spaceRoomTopic.getUrlWithParams({
        spaceId: room.space.id,
        roomId: room.id,
        topicId: result.id,
      });
    }

    case "message": {
      const {
        topic: { room, id: topicId },
      } = result;
      return routes.spaceRoomTopic.getUrlWithParams({ spaceId: room.space.id, roomId: room.id, topicId });
    }
  }
}

function composeBreadcrumb(result: ResultItem): string[] {
  assertTypename(result.__typename);
  switch (result.__typename) {
    case "space":
      return [result.name];

    case "room":
      return [result.space.name, result.name];

    case "topic": {
      const { room } = result;
      return [room.space.name, room.name, result.name];
    }

    case "message": {
      const {
        topic: { room, ...topic },
      } = result;
      return [room.space.name, room.name, topic.name];
    }
  }
}

function SearchResultBreadcrumb({ result }: { result: ResultItem }) {
  return <UISearchResultBreadcrumb>{composeBreadcrumb(result).join("/")}</UISearchResultBreadcrumb>;
}

function SearchResultMatch({ result, term }: { result: ResultItem; term: string }) {
  const content = "content_text" in result ? result.content_text : "name" in result ? result.name : "";
  const index = content?.toLowerCase().indexOf(term.toLowerCase()) ?? -1;
  return index == -1 ? null : (
    <UISearchResultMatch>
      {content?.substring(Math.max(0, index - 20), index)}
      <UISearchResultMatchHighlight>{content?.substring(index, index + term.length)}</UISearchResultMatchHighlight>
      {content?.substring(index + term.length, index + 10)}
    </UISearchResultMatch>
  );
}

// TODO: Attempt to use ItemsDropdown when we have a clearer idea of where search is going to move
const PureSearchResults = ({ className, term, results }: Props) => {
  const allItems = [...results.spaces, ...results.rooms, ...results.topics, ...results.messages].slice(0, 10);
  const { activeItem: highlightedItem, setActiveItem: setHighlightedItem } = useListWithNavigation(allItems, {
    enableKeyboard: true,
  });
  return (
    <ul className={className}>
      <PopPresenceAnimator>
        {allItems.length == 0 ? (
          <UINoResults>No results</UINoResults>
        ) : (
          allItems.map((result) => (
            <UISearchResultRow key={result.id}>
              <Link href={getItemURL(result)} passHref>
                <UISearchResultLink
                  onMouseEnter={() => setHighlightedItem(result)}
                  isHighlighted={result === highlightedItem}
                >
                  <SearchResultMatch {...{ result, term }} />
                  <SearchResultBreadcrumb {...{ result }} />
                </UISearchResultLink>
              </Link>
            </UISearchResultRow>
          ))
        )}
      </PopPresenceAnimator>
    </ul>
  );
};

export const SearchResults = styled(PureSearchResults)<{}>`
  padding: 16px 16px;
  background-color: #fff;
  border: 1px solid ${BASE_GREY_5};
  z-index: ${zIndex.Popover};
  ${borderRadius.modal}
`;

const UINoResults = styled.span<{}>``;

const UISearchResultRow = styled.li<{}>`
  & ~ & {
    margin-top: 4px;
  }
`;

const UISearchResultLink = styled.a<{ isHighlighted: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 1.5;
  gap: 24px;
  padding: 4px 8px;
  border: 1px solid transparent;
  align-items: center;
  vertical-align: center;

  overflow: hidden;
  white-space: nowrap;

  ${borderRadius.item}

  &:hover {
    background-color: ${PRIMARY_PINK_1_TRANSPARENT};
  }

  svg {
    color: ${PRIMARY_PINK_1};
  }

  ${(props) =>
    props.isHighlighted &&
    css`
      border: 1px solid ${PRIMARY_PINK_1};
      background-color: ${PRIMARY_PINK_1_TRANSPARENT};
    `}
`;

const UISearchResultMatch = styled.span<{}>``;

const UISearchResultMatchHighlight = styled.span<{}>`
  background-color: ${PRIMARY_PINK_1};
  color: white;
`;

const UISearchResultBreadcrumb = styled.span<{}>`
  flex-shrink: 0;
  font-size: 0.8rem;
`;
