import { useReorderTopicMutation } from "~frontend/gql/topics";
import { getInitialIndexes } from "./order";

/*
  Temporary: Bulk Indexing Migration Util

  Instead of doing a complex sql migration function. I think it's faster to temporarily run this code to move existing
  rooms to use our indexing.

  Eventually, all rooms will be moved to do proper indexes and this can be removed.
*/

type UseBulkTopicIndexingProps = [
  (topicIds: string[]) => Promise<void>,
  { loading: boolean; deleteAll: (topicIds: string[]) => Promise<void> }
];

export function useBulkTopicIndexing(): UseBulkTopicIndexingProps {
  const [reorder] = useReorderTopicMutation();

  let loading = false;
  function run(topicIds: string[]) {
    loading = true;
    const indexes = getInitialIndexes(topicIds.length);
    const promise = Promise.all(topicIds.map((topicId, i) => reorder({ topicId, index: indexes[i] })));
    return promise.then(() => {
      loading = false;
    });
  }

  // Util function in case we need to replace indexes
  function deleteAll(topicIds: string[]) {
    loading = true;
    const promise = Promise.all(topicIds.map((topicId) => reorder({ topicId, index: "" })));
    return promise.then(() => {
      loading = false;
    });
  }
  return [run, { loading, deleteAll }];
}
