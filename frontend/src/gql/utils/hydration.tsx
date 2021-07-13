import { ApolloClient, DocumentNode } from "@apollo/client";

interface QueryUseageData {
  query: DocumentNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export function reportQueryUsage(queryInfo: QueryUseageData) {
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

export const getApolloInitialState = () => {
  if (typeof document === "undefined") return null;

  const queriesDataElement = document.getElementById(APOLLO_INITIAL_STATE_JSON_ID) as HTMLScriptElement | null;

  if (!queriesDataElement) return null;

  return JSON.parse(queriesDataElement.innerHTML);
};

export function getQueryNameFromDocument(doc: DocumentNode): string | null {
  if (doc.kind !== "Document") return null;

  for (const definition of doc.definitions) {
    if (definition.kind !== "OperationDefinition") continue;

    if (definition.operation !== "query") continue;

    return definition.name?.value ?? null;
  }

  return null;
}

export async function prefetchRecordedQueries(client: ApolloClient<unknown>, recordings: QueryUseageData[]) {
  // For each used query - fetch it using the client

  const errors: string[] = [];

  await Promise.all(
    recordings.map(async (query) => {
      const queryName = getQueryNameFromDocument(query.query) ?? "UnknownQuery";

      try {
        const { data } = await client.query({
          query: query.query,
          variables: query.variables,
          // Don't use cache when pre-fetching queries.
          fetchPolicy: "network-only",
        });

        client.writeQuery({ data, query: query.query, variables: query.variables });
      } catch (error) {
        const message = Reflect.get(error, "message") ?? "Unknown error";

        errors.push(`[${queryName}]: ${message}`);
      }
    })
  );

  if (errors.length) {
    console.warn(`Prefetch errors`, errors.join(", "));
  }
}
