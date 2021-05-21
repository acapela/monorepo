import Link from "next/link";
import styled from "styled-components";
import { SearchResultFragment } from "~frontend/gql";

interface Props {
  className?: string;
  searchTerm: string;
  results: SearchResultFragment[];
}

function buildTopicLink({ room, topicId }: SearchResultFragment): string {
  return `/space/${room?.space?.id}/${room?.id}/${topicId}`;
}

function buildResultMatchString(result: SearchResultFragment, searchTerm: string) {
  const searchTermToMatch = searchTerm.toLowerCase();

  const matchIndicesMap = new Map([
    [result.messageContent, result.messageContent?.toLowerCase().indexOf(searchTermToMatch) ?? -1],
    [result.topicName, result.topicName?.toLowerCase().indexOf(searchTermToMatch) ?? -1],
    [result.attachmentName, result.attachmentName?.toLowerCase().indexOf(searchTermToMatch) ?? -1],
    [result.transcript, result.transcript?.toLowerCase().indexOf(searchTermToMatch) ?? -1],
  ]);

  for (const [prop, index] of matchIndicesMap.entries()) {
    console.log(prop, index);

    if (index > -1) {
      return (
        <>
          {prop?.substr(Math.max(0, index - 20), index)}
          <UISearchResultMatchHighlight>{prop?.substr(index, searchTerm.length)}</UISearchResultMatchHighlight>
          {prop?.substr(index + searchTerm.length, 10)}
        </>
      );
    }
  }
}

function buildResultBreadcrumb({ room, topicName }: SearchResultFragment): string {
  const spaceName = room?.space?.name;
  const roomName = room?.name;

  return `${spaceName}/${roomName}/${topicName}`;
}

const PureSearchResults = ({ className, searchTerm, results }: Props) => {
  return (
    <ul className={className}>
      {!results.length && <UINoResults>No results</UINoResults>}
      {results.map((result, idx) => (
        <UISearchResultRow key={idx}>
          <Link href={buildTopicLink(result)} passHref>
            <UISearchResultLink>
              <UISearchResultMatch>{buildResultMatchString(result, searchTerm)}</UISearchResultMatch>
              <UISearchResultBreadcrumb>{buildResultBreadcrumb(result)}</UISearchResultBreadcrumb>
            </UISearchResultLink>
          </Link>
        </UISearchResultRow>
      ))}
    </ul>
  );
};

export const SearchResults = styled(PureSearchResults)`
  padding: 1rem;
  background-color: #fff;
  border-radius: 1rem;
`;

const UINoResults = styled.span``;

const UISearchResultRow = styled.li`
  & ~ & {
    margin-top: 0.2rem;
  }
`;

const UISearchResultLink = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;

  :hover {
    background-color: #ffeddd;
  }
`;

const UISearchResultMatch = styled.span``;

const UISearchResultMatchHighlight = styled.span`
  background-color: #f1cf54;
`;

const UISearchResultBreadcrumb = styled.span`
  flex-shrink: 0;
`;
