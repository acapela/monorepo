import Link from "next/link";
import styled from "styled-components";
import { HIGHLIGHT_COLOR } from "~ui/colors";
import { SearchResultFragment } from "~gql";
import { borderRadius } from "~ui/baseStyles";
import { zIndex } from "~ui/zIndex";

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

const PureSearchResults = ({ className, searchTerm, results }: Props) => (
  <ul className={className}>
    {!results.length && <UINoResults>No results</UINoResults>}
    {results.map((result, idx) => (
      <UISearchResultRow key={idx}>
        <Link href={composeTopicLink(result)} passHref>
          <UISearchResultLink>
            <UISearchResultMatch>{renderResultMatchString(result, searchTerm)}</UISearchResultMatch>
            <UISearchResultBreadcrumb>{composeResultBreadcrumb(result)}</UISearchResultBreadcrumb>
          </UISearchResultLink>
        </Link>
      </UISearchResultRow>
    ))}
  </ul>
);

export const SearchResults = styled(PureSearchResults)`
  padding: 1rem 0.6rem;
  background-color: #fff;
  border: 1px solid rgba(190, 190, 190, 0.25);
  z-index: ${zIndex.Popover};
  ${borderRadius.modal}
`;

const UINoResults = styled.span``;

const UISearchResultRow = styled.li`
  & ~ & {
    margin-top: 0.4rem;
  }
`;

const UISearchResultLink = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 1.5;
  padding: 0.4rem 0.8rem;
  ${borderRadius.item}

  :hover {
    background-color: #ffeddd;
  }
`;

const UISearchResultMatch = styled.span``;

const UISearchResultMatchHighlight = styled.span`
  background-color: ${HIGHLIGHT_COLOR};
`;

const UISearchResultBreadcrumb = styled.span`
  flex-shrink: 0;
`;
