import { DocumentNode } from "@apollo/client";
import { FragmentDefinitionNode } from "graphql";
import produceWithImmer, { Draft } from "immer";
import { memoize } from "lodash";
import { assert } from "~shared/assert";
import { getCurrentApolloClientHandler } from "./proxy";

export function createFragment<Data>(fragmentNodeGetter: () => DocumentNode) {
  const getFragment = memoize(fragmentNodeGetter);

  const validateAndGetFragments = memoize(() => {
    const fragment = getFragment();
    const fragments: FragmentDefinitionNode[] = [];

    for (const def of fragment.definitions) {
      if (def.kind !== "FragmentDefinition") {
        throw new Error(`Fragment can only have fragment definitions at root level.`);
      }

      fragments.push(def);
    }

    if (fragments.length === 0) {
      throw new Error(`Fragment definition has to include at least one fragment.`);
    }

    return fragments;
  });

  const getPrimaryFragment = memoize(() => {
    const fragments = validateAndGetFragments();

    return fragments[fragments.length - 1];
  });

  const getPrimaryFragmentName = memoize(() => {
    const primaryFragment = getPrimaryFragment();

    return primaryFragment.name.value;
  });

  function getTypeName() {
    const primaryFragment = getPrimaryFragment();
    return primaryFragment.typeCondition.name.value;
  }

  function getFragmentId(idValue: string) {
    return `${getTypeName()}:${idValue}`;
  }

  function produce(id: string, producer: (dataDraft: Draft<Data>) => void) {
    const currentData = read(id);

    if (currentData === null) {
      return;
    }

    const newData = produceWithImmer(currentData, (draft) => {
      producer(draft);

      return draft;
    });

    return newData;
  }

  function read(id: string) {
    const fullId = getFragmentId(id);

    const client = getCurrentApolloClientHandler();
    return client.readFragment<Data>({ id: fullId, fragment: getFragment(), fragmentName: getPrimaryFragmentName() });
  }

  function assertRead(id: string) {
    const data = read(id);

    assert(data, `Failed fragment assertRead, no data`);

    return data;
  }

  function write(id: string, data: Data) {
    const fullId = getFragmentId(id);
    const client = getCurrentApolloClientHandler();

    return client.writeFragment<Data>({
      id: fullId,
      fragment: getFragment(),
      fragmentName: getPrimaryFragmentName(),
      data,
    });
  }

  function update(id: string, updater: (dataDraft: Draft<Data>) => void) {
    const newData = produce(id, updater);

    if (newData === undefined) {
      return;
    }
    write(id, newData);
  }

  function getFragmentDefinition() {
    return getFragment();
  }

  getFragmentDefinition.update = update;
  getFragmentDefinition.write = write;
  getFragmentDefinition.read = read;
  getFragmentDefinition.assertRead = assertRead;
  getFragmentDefinition.getFragmentId = getFragmentId;
  getFragmentDefinition.produce = produce;

  return getFragmentDefinition;
}
