import { Index } from "flexsearch";
import { mapValues, memoize, pick, values } from "lodash";
import { makeAutoObservable } from "mobx";

import { Entity } from "~clientdb";
import { assert } from "~shared/assert";
import { measureTime } from "~shared/dev";
import { runUntracked } from "~shared/mobxUtils";
import { isNotNullish } from "~shared/nullish";
import { typedKeys } from "~shared/object";

import { EntityStore } from "./store";
import { computedArray } from "./utils/computedArray";

interface EntitySearchFieldDetailedConfig<Value> {
  extract?: (value: Value) => string;
  boost?: number;
}

type EntitySearchFieldConfig<Value> = true | EntitySearchFieldDetailedConfig<Value>;

function isDetailedEntitySearchFieldConfig<Value>(
  config: EntitySearchFieldConfig<Value>
): config is EntitySearchFieldDetailedConfig<Value> {
  return config !== true;
}

type EntitySearchFields<Data> = {
  [key in keyof Data]?: EntitySearchFieldConfig<Data[key]>;
};

export interface EntitySearchConfig<Data> {
  fields: EntitySearchFields<Data>;
  persistIndex?: boolean;
}

export interface EntitySearch<Data, Connections> {
  search(term: string): Entity<Data, Connections>[];
  destroy(): void;
}

const DEV_SHOULD_MEASURE_PERFORMANCE = true;

export function createEntitySearch<Data, Connections>(
  { fields }: EntitySearchConfig<Data>,
  store: EntityStore<Data, Connections>
): EntitySearch<Data, Connections> {
  const fieldsList = typedKeys(fields);
  const entityName = store.definition.config.name;

  function prepareEntitySearchTerm(entity: Entity<Data, Connections>): string {
    const dataToIndex: Partial<Data> = pick(entity, fieldsList);

    const indexedValuesMap = mapValues(dataToIndex, (value, key) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const fieldConfig = fields[key as keyof Data]!;

      if (!isDetailedEntitySearchFieldConfig(fieldConfig) || !fieldConfig.extract) {
        assert(typeof value === "string", `Only string values can be indexed if no convert function is provided`);
        return value as string;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const stringValue = fieldConfig.extract(value!);

      return stringValue;
    });

    const term = values<string>(indexedValuesMap).join(" ");

    return term;
  }

  const index = new Index({
    preset: "match",
    // Will find "hello", when looking for "he"
    tokenize: "forward",
    // Will normalize custom characters.
    charset: "lating:advanced",
    language: "en",
  });

  function populateIndex() {
    const end = measureTime(`Indexing existing ${entityName} items`, DEV_SHOULD_MEASURE_PERFORMANCE);
    runUntracked(() => {
      store.items.forEach((entity) => {
        index.add(entity.getKey(), prepareEntitySearchTerm(entity));
      });
    });
    end();
  }

  /**
   * Changes of items can change search results. But index is not observable so we need a way to track updates in it to
   * force 're-search'.
   */
  const status = makeAutoObservable({ updatesCount: 0 });

  function trackUpdate() {
    status.updatesCount++;
  }

  const listenToUpdatesIfNeeded = memoize(() => {
    const cancelAdd = store.events.on("itemAdded", (entity) => {
      index.add(entity.getKey(), prepareEntitySearchTerm(entity));
      trackUpdate();
    });

    const cancelDelete = store.events.on("itemRemoved", (entity) => {
      trackUpdate();
      index.remove(entity.getKey());
    });

    const cancelUpdate = store.events.on("itemUpdated", (entity) => {
      index.update(entity.getKey(), prepareEntitySearchTerm(entity));
      trackUpdate();
    });

    return function cancel() {
      cancelAdd();
      cancelDelete();
      cancelUpdate();
    };
  });

  const initializeIfNeeded = memoize(() => {
    populateIndex();

    return listenToUpdatesIfNeeded();
  });

  function search(input: string) {
    // Return empty list of empty input. No need to make it observable.
    if (!input.trim().length) return [];

    // Index is built on first search (aka. it is lazy)
    initializeIfNeeded();

    return computedArray(() => {
      // We simply read this value to let mobx know to re-compute if there is change in the index
      status.updatesCount;
      const end = measureTime(`Search ${entityName}`, DEV_SHOULD_MEASURE_PERFORMANCE);
      const foundIds = index.search(input, { limit: 20, suggest: true });

      end();

      return (
        foundIds
          .map((id) => store.findById(id as string))
          // It is possible we found items that we dont have access to (they're also indexed) - filter them out.
          .filter(isNotNullish)
      );
    }).get();
  }

  function destroy() {
    const cancelUpdatesTracking = initializeIfNeeded();

    cancelUpdatesTracking();
  }

  return {
    search,
    destroy,
  };
}
