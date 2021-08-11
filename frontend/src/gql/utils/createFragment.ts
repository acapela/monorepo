import { DocumentNode } from "@apollo/client";
import { FragmentDefinitionNode } from "graphql";
import produceWithImmer, { Draft } from "immer";
import { memoize } from "lodash";
import { assert } from "~shared/assert";
import { getCurrentApolloClientHandler } from "./proxy";

/**
 * This creates type-safe wrapper around graphql fragment wrapper.
 *
 * The main use case is to easily read/update data of some fragments in type-safe way.
 *
 * createFragment returns function that creates memoized version of fragment DocumentNode,
 * so it can be used in other fragments.
 *
 * Also, returned function has attached fragment utilities.
 *
 * eg.
 *
 * const UserFragment = createFragment(() => gql`
 *   fragment UserData on user {
 *     id
 *     name
 *   }
 * `)
 *
 * // Using in other fragment
 * gql`
 *   ${UserFragment()}
 *   fragment Other on user {
 *     ...UserData
 *     email
 *   }
 * `
 *
 * Updating etc.
 *
 * UserFragment.update(123, user => user.name = 'Bob');
 * UserFragment.read(123).name
 *
 * UserFragment.getFragmentId(123) -> 'user:123' (default way apollo stores ref id - __typename:id-value)
 *
 *
 */
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

  /**
   * Single gql document might include multiple fragments.
   *
   * It assumes the last one is 'primary' one we'll perform operations on.
   */
  const getPrimaryFragment = memoize(() => {
    const fragments = validateAndGetFragments();

    return fragments[fragments.length - 1];
  });

  const getPrimaryFragmentName = memoize(() => {
    const primaryFragment = getPrimaryFragment();

    return primaryFragment.name.value;
  });

  /**
   * Will get __typename of object this fragment is used on.
   */
  function getTypeName() {
    const primaryFragment = getPrimaryFragment();
    return primaryFragment.typeCondition.name.value;
  }

  /**
   * Will get apollo compatible ref id matching some fragment for some object.
   *
   * eg having fragment User on user { id name }
   * __typename is 'user' and id is 'ID' field.
   *
   * It means full id of user 123 fragment is 'user:123'
   */
  function getFragmentId(idValue: string) {
    return `${getTypeName()}:${idValue}`;
  }

  /**
   * Will create fragment-like data new object as a clone of already cached data with some modifications applied.
   *
   * Useful for passing full object data with slight modifications to eg. optimistic updates.
   */
  function produce(id: string, producer: (dataDraft: Draft<Data>) => void) {
    const currentData = read(id);

    if (currentData === null) {
      return;
    }

    const newData = produceWithImmer(currentData, (draft: Draft<Data>) => {
      producer(draft);

      return draft;
    });

    return newData;
  }

  /**
   * Will try to read cache of fragment for given id if it's in the cache
   */
  function read(id: string) {
    const fullId = getFragmentId(id);

    const client = getCurrentApolloClientHandler();
    return client.readFragment<Data>({ id: fullId, fragment: getFragment(), fragmentName: getPrimaryFragmentName() });
  }

  /**
   * Will read fragment data for given id and throw if the data is not present.
   *
   * Useful for dealing with data where we're sure it's in the cache eg. optimistic update on data we just read
   */
  function assertRead(id: string) {
    const data = read(id);

    assert(data, `Failed fragment assertRead, no data`);

    return data;
  }

  /**
   * Will write new data to cache of a fragment.
   *
   * Note it has to include full data. If you want to change only some fields, use update function instead
   */
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

  /**
   * Allows updating fragment data basing on existing data of the fragment.
   *
   * Will do nothing if not able to read existing data.
   *
   * UserFragment.update(123, user => user.name = 'Bob');
   */
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
