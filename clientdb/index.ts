import { find, forEach, mapValues } from "lodash";

import { assert } from "~shared/assert";
import { isClient } from "~shared/document";

import { EntityClient, EntityClientByDefinition, createEntityClient } from "./entity/client";
import { DbContext, DbContextInstance } from "./entity/context";
import { PersistanceAdapterInfo } from "./entity/db/adapter";
import { EntityDefinition } from "./entity/definition";
import { DatabaseLinker } from "./entity/entitiesConnections";
import { EntitiesMap } from "./entity/entitiesMap";
import { createEntitiesPersistedCache } from "./entity/entityPersistedCache";
import { initializePersistance } from "./entity/initializePersistance";
import { initializePersistedKeyValueCache } from "./entity/persistedCache";

export * from "./entity/index";

interface ClientDbConfig {
  db: PersistanceAdapterInfo;
  contexts?: DbContextInstance<unknown>[];
  disableSync?: boolean;
  onDestroyRequest?: () => void;
}

type EntitiesClientsMap<Entities extends EntitiesMap> = {
  [key in keyof Entities]: EntityClientByDefinition<Entities[key]>;
};

type ClientDbExtra = {
  destroy: () => void;
  linker: DatabaseLinker;
};

type ClientDb<Entities extends EntitiesMap> = ClientDbExtra & EntitiesClientsMap<Entities>;

export async function createClientDb<Entities extends EntitiesMap>(
  { db, contexts, onDestroyRequest, disableSync = false }: ClientDbConfig,
  definitionsMap: Entities
): Promise<ClientDb<Entities>> {
  const definitions = Object.values(definitionsMap);

  assert(isClient, "Client DB can only be created on client side");

  const [persistanceDb, cacheTable] = await initializePersistance(definitions, db, onDestroyRequest);
  const persistedCacheManager = await initializePersistedKeyValueCache(cacheTable);

  const entityPersistedCacheManager = createEntitiesPersistedCache(persistedCacheManager);

  const databaseLinker: DatabaseLinker = {
    entityCache: entityPersistedCacheManager,
    getEntity<Data, Connections>(definition: EntityDefinition<Data, Connections>): EntityClient<Data, Connections> {
      const foundClient = find(entityClients, (client: EntityClient<unknown, unknown>) => {
        return client.definition === definition;
      });

      if (!foundClient) {
        throw new Error(
          `no client for given definition (${definition.config.name}) in this db. Make sure it is added to entities map when creating client db`
        );
      }

      return foundClient;
    },
    getContextValue<V>(context: DbContext<V>) {
      if (!contexts) {
        throw new Error(`No context are defined for this db`);
      }

      const correspondingContextInstance = contexts.find((contextInstance) => contextInstance.context === context);

      if (!correspondingContextInstance) {
        throw new Error(`No context in this db matching requested one`);
      }

      return correspondingContextInstance.value as V;
    },
  };

  const entityClients = mapValues(definitionsMap, (definition) => {
    const entityClient = createEntityClient(definition, {
      linker: databaseLinker,
      persistanceDb,
      disableSync,
    });

    return entityClient;
  }) as EntitiesClientsMap<Entities>;

  function destroy() {
    // ! close indexeddb connection so in case new clientdb is created for same name - it will be able to connect.
    persistanceDb.close();
    forEach(entityClients, (client: EntityClient<unknown, unknown>) => {
      client.destroy();
    });
  }

  const persistanceLoadedPromise = Promise.all(
    Object.values<EntityClient<unknown, unknown>>(entityClients).map((client) => client.persistanceLoaded)
  );

  if (!disableSync) {
    // Start sync at once when all persistance data is loaded
    persistanceLoadedPromise.then(() => {
      forEach(entityClients, (client: EntityClient<unknown, unknown>) => {
        client.startSync();
      });
    });

    const firstSyncPromise = Promise.all(
      Object.values<EntityClient<unknown, unknown>>(entityClients).map((client) => client.firstSyncLoaded)
    );

    await Promise.all([persistanceLoadedPromise, firstSyncPromise]);
  } else {
    await persistanceLoadedPromise;
  }

  const clientDbMethods: ClientDbExtra = {
    destroy,
    linker: databaseLinker,
  };

  return { ...entityClients, ...clientDbMethods };
}
