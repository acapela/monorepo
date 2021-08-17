import {
  DocumentNode,
  MutationFunctionOptions,
  MutationHookOptions,
  MutationOptions,
  useMutation as useRawMutation,
} from "@apollo/client";
import { memoize, merge } from "lodash";
import { DeepPartial } from "utility-types";

import { getRenderedApolloClient } from "~frontend/apollo/client";
import { createPromisesGroup } from "~shared/promiseGroup";
import { ValueUpdater, updateValue } from "~shared/updateValue";

import { runWithApolloProxy } from "./proxy";
import { UnwrapQueryData, unwrapQueryData } from "./unwrapQueryData";
import { RequestWithRole, addRoleToContext } from "./withRole";

interface MutationDefinitionOptions<Data, Variables> extends RequestWithRole {
  // This callback is called optionally twice for both optimistic and actual response
  onOptimisticOrActualResponse?: (
    data: NonNullable<UnwrapQueryData<Data>>,
    variables: Variables,
    phase: MutationResultPhase
  ) => void;
  onOptimisticResponse?: (data: NonNullable<UnwrapQueryData<Data>>, variables: Variables) => void;
  onActualResponse?: (data: NonNullable<UnwrapQueryData<Data>>, variables: Variables) => void;
  optimisticResponse?: (vars: Variables) => Data;
  defaultVariables?: () => DeepPartial<Variables>;
  inputMapper?: ValueUpdater<Variables>;
}

type MutationResultPhase = "actual" | "optimistic";

const runningMutationsGroup = createPromisesGroup();

export const waitForAllRunningMutationsToFinish = runningMutationsGroup.waitForAllRunningPromises;

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

  function getFinalVariables(input: Variables): Variables {
    let finalVariables = input;
    if (mutationDefinitionOptions?.defaultVariables) {
      const defaultVariables = mutationDefinitionOptions.defaultVariables();
      finalVariables = merge(defaultVariables, input) as Variables;
    }

    if (mutationDefinitionOptions?.inputMapper) {
      finalVariables = updateValue(finalVariables, mutationDefinitionOptions.inputMapper);
    }

    return finalVariables;
  }

  function useMutation(options?: MutationHookOptions<Data, Variables>) {
    const [runMutationRaw, result] = useRawMutation<Data, Variables>(getMutation(), options);

    async function runMutation(variables: Variables, options?: MutationFunctionOptions<Data, Variables>) {
      return runningMutationsGroup.run(async () => {
        variables = getFinalVariables(variables);
        const rawResult = await runMutationRaw({
          ...options,
          optimisticResponse: mutationDefinitionOptions?.optimisticResponse,
          context: addRoleToContext(options?.context, mutationDefinitionOptions?.requestWithRole),
          variables,
          update: createMutationUpdateCallback(variables, options),
        });

        const resultData = unwrapQueryData(rawResult.data);

        return [resultData, rawResult] as const;
      });
    }

    return [runMutation, result] as const;
  }

  async function mutate(variables: Variables, options?: MutationOptions<Data, Variables>) {
    return runningMutationsGroup.run(async () => {
      variables = getFinalVariables(variables);

      const rawResult = await getRenderedApolloClient().mutate<Data, Variables>({
        ...options,
        optimisticResponse: mutationDefinitionOptions?.optimisticResponse,
        context: addRoleToContext(options?.context, mutationDefinitionOptions?.requestWithRole),
        mutation: getMutation(),
        variables,
        update: createMutationUpdateCallback(variables, options),
      });

      const resultData = unwrapQueryData(rawResult.data);

      return [resultData, rawResult] as const;
    });
  }

  const manager = {
    mutate,
  };

  return [useMutation, manager] as const;
}
