import { gql } from "@apollo/client";
import { GetSearchResultsQuery, GetSearchResultsQueryVariables } from "./generated";
import { createQuery } from "./utils";

const SearchResult = () => gql`
  fragment SearchResult on full_text_search {
    topicId: topic_id
    topicName: topic_name
    messageId: message_id
    messageContent: message_content
    attachmentName: attachment_name
    transcript
    room {
      id
      name
      space {
        id
        name
      }
    }
  }
`;

export const [useFullTextSearch] = createQuery<GetSearchResultsQuery, GetSearchResultsQueryVariables>(
  () => gql`
    ${SearchResult()}
    query GetSearchResults($term: String!) {
      results: search_full_text(args: { search: $term }) {
        ...SearchResult
      }
    }
  `
);
