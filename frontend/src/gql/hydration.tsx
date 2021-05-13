import { ApolloClient, DocumentNode } from "@apollo/client";
import memoize from "lodash/memoize";

interface QueryUseageData {
  query: DocumentNode;
  variables?: Record<string, any> | void;
}

type QueryUseageRecorder = (query: QueryUseageData) => void;

const queryUseageRecorders = new Set<QueryUseageRecorder>();

export function startRecordingUsedQueries() {
  const recordedQueries: Array<QueryUseageData> = [];

  const recorder: QueryUseageRecorder = (queryInfo) => {
    recordedQueries.push({ ...queryInfo });
  };

  queryUseageRecorders.add(recorder);

  function finishRecording() {
    queryUseageRecorders.delete(recorder);

    return recordedQueries;
  }

  return [finishRecording, recordedQueries] as const;
}

export function reportQueryUseage(queryInfo: QueryUseageData) {
  queryUseageRecorders.forEach((recorder) => {
    recorder(queryInfo);
  });
}

const APOLLO_INITIAL_STATE_JSON_ID = "apollo-initial-state";

export function ApolloInitialState({ state }: { state: unknown }) {
  if (!state) return null;

  return (
    <script
      id={APOLLO_INITIAL_STATE_JSON_ID}
      type="text/json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(state) }}
    ></script>
  );
}

export const getApolloInitialState = memoize(() => {
  if (typeof document === "undefined") return null;

  const queriesDataElement = document.getElementById(APOLLO_INITIAL_STATE_JSON_ID) as HTMLScriptElement | null;

  if (!queriesDataElement) return null;

  return JSON.parse(queriesDataElement.innerHTML);
});

export async function prefetchRecordedQueries(client: ApolloClient<unknown>, recordings: QueryUseageData[]) {
  // For each used query - fetch it using the client

  await Promise.all(
    recordings.map(async (query) => {
      try {
        const { data } = await client.query({
          query: query.query,
          variables: query.variables,
        });

        client.writeQuery({ data, query: query.query, variables: query.variables });
      } catch (error) {
        //
      }
    })
  );
}
