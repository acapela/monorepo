import {
  DocumentNode,
  MutationFunctionOptions,
  MutationHookOptions,
  MutationOptions,
  useMutation as useRawMutation,
} from "@apollo/client";
import { memoize } from "lodash";
import { getRenderedApolloClient } from "~frontend/apollo/client";
import { runWithApolloProxy } from "./proxy";
import { UnwrapQueryData, unwrapQueryData } from "./unwrapQueryData";

interface MutationDefinitionOptions<Data, Variables> {
  // This callback is called optionally twice for both optimistic and actual response
  onOptimisticOrActualResponse?: (
    data: NonNullable<UnwrapQueryData<Data>>,
    variables: Variables,
    phase: MutationResultPhase
  ) => void;
  onOptimisticResponse?: (data: NonNullable<UnwrapQueryData<Data>>, variables: Variables) => void;
  onActualResponse?: (data: NonNullable<UnwrapQueryData<Data>>, variables: Variables) => void;
  optimisticResponse?: (vars: Variables) => Data;
}

type MutationResultPhase = "actual" | "optimistic";

/**
 * This function allows creating type-safe mutation wrapper around mutation gql document.
 *
 * When creating, it is required to provide 2 generic types for data and variables.
 *
 * It returns tuple with [react hook, {mutate}].
 *
 * Both tuple elements work almost the same, but hook has loading/error state attached.
 */
export function createMutation<Data, Variables>(
  mutation: () => DocumentNode,
  mutationDefinitionOptions?: MutationDefinitionOptions<Data, Variables>
) {
  const getMutation = memoize(mutation);

  function getNextPhase(currentPhase: MutationResultPhase | null, hasOptimisticResponse: boolean): MutationResultPhase {
    if (currentPhase === null && hasOptimisticResponse) {
      return "optimistic";
    }
    return "actual";
  }

  function createMutationUpdateCallback(variables: Variables, options?: MutationFunctionOptions<Data, Variables>) {
    const hasOptimisticUpdate = !!mutationDefinitionOptions?.optimisticResponse || !!options?.optimisticResponse;
    let currentPhase: MutationResultPhase | null = null;
    const mutationUpdateCallback: MutationFunctionOptions<Data, Variables>["update"] = (cache, rawResult) => {
      const phase = getNextPhase(currentPhase, hasOptimisticUpdate);
      currentPhase = phase;

      runWithApolloProxy(cache, () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const resultData = unwrapQueryData(rawResult.data)!;

        if (resultData) {
          mutationDefinitionOptions?.onOptimisticOrActualResponse?.(resultData, variables, phase);

          if (phase === "actual") {
            mutationDefinitionOptions?.onActualResponse?.(resultData, variables);
          }

          if (phase === "optimistic") {
            mutationDefinitionOptions?.onOptimisticResponse?.(resultData, variables);
          }
        }
      });
    };

    return mutationUpdateCallback;
  }

  function useMutation(options?: MutationHookOptions<Data, Variables>) {
    const [runMutationRaw, result] = useRawMutation<Data, Variables>(getMutation(), options);

    async function runMutation(variables: Variables, options?: MutationFunctionOptions<Data, Variables>) {
      const rawResult = await runMutationRaw({
        optimisticResponse: mutationDefinitionOptions?.optimisticResponse,
        ...options,
        variables,
        update: createMutationUpdateCallback(variables, options),
      });

      const resultData = unwrapQueryData(rawResult.data);

      return [resultData, rawResult] as const;
    }

    return [runMutation, result] as const;
  }

  async function mutate(variables: Variables, options?: MutationOptions<Data, Variables>) {
    const rawResult = await getRenderedApolloClient().mutate<Data, Variables>({
      optimisticResponse: mutationDefinitionOptions?.optimisticResponse,
      ...options,
      mutation: getMutation(),
      variables,
      update: createMutationUpdateCallback(variables, options),
    });

    const resultData = unwrapQueryData(rawResult.data);

    return [resultData, rawResult] as const;
  }

  const manager = {
    mutate,
  };

  return [useMutation, manager] as const;
}
