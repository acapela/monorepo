import { gql } from "@apollo/client";

import { SearchResultsQuery, SearchResultsQueryVariables } from "~gql";

import { createQuery } from "./utils";

export const [useFullTextSearchQuery] = createQuery<SearchResultsQuery, SearchResultsQueryVariables>(
  () => gql`
    query SearchResults($term: String!) {
      spaces: space(where: { name: { _ilike: $term } }, limit: 10) {
        id
        name
      }
      rooms: room(where: { name: { _ilike: $term } }, limit: 10) {
        id
        name
        space {
          id
          name
        }
      }
      topics: topic(where: { name: { _ilike: $term } }, limit: 10) {
        id
        name
        room {
          id
          name
          space {
            id
            name
          }
        }
      }
      messages: message(where: { content_text: { _ilike: $term } }, limit: 10) {
        id
        content_text
        topic {
          id
          name
          room {
            id
            name
            space {
              id
              name
            }
          }
        }
      }
    }
  `
);
