import { gql } from "@apollo/client";
import { SearchResultsQuery, SearchResultsQueryVariables } from "~gql";
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

export const [useFullTextSearchQuery] = createQuery<SearchResultsQuery, SearchResultsQueryVariables>(
  () => gql`
    ${SearchResult()}
    query SearchResults($term: String!) {
      results: search_full_text_topic(args: { search: $term }) {
        ...SearchResult
      }
    }
  `
);
