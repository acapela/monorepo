import { memoize } from "lodash";
import MiniSearch from "minisearch";
import { runInAction } from "mobx";
import { computed, makeAutoObservable } from "mobx";

import { Entity } from "~clientdb";
import { assert } from "~shared/assert";
import { measureTime } from "~shared/dev";
import { typedKeys } from "~shared/object";

import { EntityStore } from "./store";

/**
 * This will be a bit nerdy comment, but I'm actually a bit excited and I'd like to share story of this search approach. Feel free to skip it if you want.
 *
 * TLDR: You can search inside 5000 long list under 1ms. No matter how big items are.
 *
 * MiniSearch is amazing, because time of search depends only on search keyword length, even if you have 1000s of items. No matter how big those items are.
 *
 * I really strongly recommend reading blog post about it https://lucaongaro.eu/blog/2019/01/30/minisearch-client-side-fulltext-search-engine.html
 * it is simply a nerd-joy to learn about it. Also author responses in github repo on issues is really great read.
 *
 * How it works? (simplified)
 *
 * Assuming we have items like [hello, hell, help], index will look something like
 * {
 *   hel: {
 *     p: [3], // 3rd item is matching
 *     l: {
 *       "": [2], // 2nd item is matching
 *       "o": [1] // 1st item is matching
 *     }
 *   }
 * }
 *
 * It means no matter how many items we have, it is exactly as easy to find list of matching items.
 *
 * If we have multi-word items like "hello world", it is simply splitted by word and recorded the same way, only also remembering which word of term it is eg
 * {
 *   hello: {
 *     1: 0 < hello is first word of item 1
 *   },
 *   world: {
 *     1: 1 < world is second word of item 1
 *   }
 * }
 *
 * Also, creation of index is relatively cheap. It is usually also smaller then the data itself (due to many items using the same words and being indexed together).
 *
 * Index can also be persisted itself in local db if this will be needed, but author actually recommends not doing it until
 * absolutely necessary - https://github.com/lucaong/minisearch/issues/76
 */

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
}

export interface EntitySearch<Data, Connections> {
  search(term: string): Entity<Data, Connections>[];
  destroy(): void;
}

const DEV_MEASURE = true;

export function createEntitySearch<Data, Connections>(
  { fields }: EntitySearchConfig<Data>,
  store: EntityStore<Data, Connections>
): EntitySearch<Data, Connections> {
  const fieldsList = typedKeys(fields);

  function extractField(item: Data, key: string): string {
    const fieldConfig = fields[key as keyof Data];
    const rawValue = item[key as keyof Data];

    if (!fieldConfig) {
      assert(typeof rawValue === "string", `Key ${key} inside item is not a string`);
      return rawValue;
    }

    if (!isDetailedEntitySearchFieldConfig(fieldConfig)) {
      assert(typeof rawValue === "string", `Key ${key} inside item is not a string`);
      return rawValue;
    }

    if (!fieldConfig.extract) {
      assert(typeof rawValue === "string", `Key ${key} inside item is not a string`);
      return rawValue;
    }

    return fieldConfig.extract(rawValue);
  }

  const engine = new MiniSearch<Data>({
    fields: fieldsList as string[],
    extractField,
    idField: store.definition.config.keyField as string,
    searchOptions: {
      // Will match "hello" item for "he" input keyword. Otherwise only full words would be matched
      prefix: true,
    },
  });

  const populateIndexIfNeeded = memoize(() => {
    const end = measureTime(`Create ${store.definition.config.name} index`, DEV_MEASURE);
    runInAction(() => {
      engine.addAll(store.items);
    });
    end();
  });

  /**
   * Changes of items can change search results. But index is not observable so we need a way to track updates in it to
   * force 're-search'.
   */
  const status = makeAutoObservable({ updatesCount: 0 });

  function trackUpdate() {
    status.updatesCount++;
  }

  const initializeUpdatesIfNeeded = memoize(() => {
    const cancelAdd = store.events.on("itemAdded", (entity) => {
      trackUpdate();
      engine.add(entity);
    });
    const cancelDelete = store.events.on("itemRemoved", (entity) => {
      trackUpdate();
      engine.remove(entity);
    });
    /**
     * Important!
     *
     * To 'update' single item index we need to first remove it and then add it again.
     *
     * However, to remove item, we must provide having exact same data as it has when being added to the index initially.
     *
     * Otherwise it will be impossible to know from what parts of the index it has to be removed.
     *
     * Thus we remove item in 'itemWillUpdate' (still having original data) and instantly add it again in 'itemUpdated' (when item has new data)
     */
    const cancelWillUpdate = store.events.on("itemWillUpdate", (entity) => {
      trackUpdate();
      engine.remove(entity);
    });
    const cancelUpdate = store.events.on("itemUpdated", (entity) => {
      trackUpdate();
      engine.add(entity);
    });

    return function cancel() {
      cancelAdd();
      cancelDelete();
      cancelWillUpdate();
      cancelUpdate();
    };
  });

  const initializeIfNeeded = memoize(() => {
    populateIndexIfNeeded();

    return initializeUpdatesIfNeeded();
  });

  function search(input: string) {
    // Return empty list of empty input. No need to make it observable.
    if (!input.trim().length) return [];

    initializeIfNeeded();

    return computed(() => {
      // We simply read this value to let mobx know to re-compute if there is change in the index
      status.updatesCount;
      const end = measureTime(`Search ${store.definition.config.name} for term ${input}`, DEV_MEASURE);
      const rawResults = engine.search(input);

      end();

      return rawResults.map((result) => store.assertFindById(result.id));
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
