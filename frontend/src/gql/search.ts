import { gql } from "@apollo/client";
import {
  SearchResultFragment as SearchResultFragmentType,
  SearchResultsQuery,
  SearchResultsQueryVariables,
} from "~gql";
import { createFragment, createQuery } from "./utils";

const SearchResultFragment = createFragment<SearchResultFragmentType>(
  () => gql`
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
  `
);

export const [useFullTextSearchQuery] = createQuery<SearchResultsQuery, SearchResultsQueryVariables>(
  () => gql`
    ${SearchResultFragment()}
    query SearchResults($term: String!) {
      results: search_full_text_topic(args: { search: $term }) {
        ...SearchResult
      }
    }
  `
);
