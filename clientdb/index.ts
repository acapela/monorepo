import { find, forEach, mapValues } from "lodash";

import { assert } from "~shared/assert";
import { isClient } from "~shared/document";
import { typedKeys } from "~shared/object";

import { EntityClient, EntityClientByDefinition, createEntityClient } from "./entity/client";
import { DbContext, DbContextInstance } from "./entity/context";
import { PersistanceAdapterInfo } from "./entity/db/adapter";
import { EntityDefinition } from "./entity/definition";
import { DatabaseUtilities } from "./entity/entitiesConnections";
import { EntitiesMap } from "./entity/entitiesMap";
import { initializePersistance } from "./entity/initializePersistance";

export * from "./entity/index";

interface ClientDbConfig {
  db: PersistanceAdapterInfo;
  contexts?: DbContextInstance<unknown>[];
}

type EntitiesClientsMap<Entities extends EntitiesMap> = {
  [key in keyof Entities]: EntityClientByDefinition<Entities[key]>;
};

type ClientDbExtra = {
  destroy: () => void;
};

type ClientDb<Entities extends EntitiesMap> = ClientDbExtra & EntitiesClientsMap<Entities>;

export async function createClientDb<Entities extends EntitiesMap>(
  { db, contexts }: ClientDbConfig,
  definitionsMap: Entities
): Promise<ClientDb<Entities>> {
  const definitions = Object.values(definitionsMap);

  assert(isClient, "Client DB can only be created on client side");

  const persistanceDb = await initializePersistance(definitions, db);

  const databaseUtilities: DatabaseUtilities = {
    getEntity<Data, Connections>(definition: EntityDefinition<Data, Connections>): EntityClient<Data, Connections> {
      const foundClient = find(entityClients, (client: EntityClient<unknown, unknown>) => {
        return client.definition === definition;
      });

      if (!foundClient) {
        throw new Error("no client for given definition in this db");
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
      databaseUtilities: databaseUtilities,
      persistanceDb,
    });

    return entityClient;
  }) as EntitiesClientsMap<Entities>;

  function destroy() {
    forEach(entityClients, (client: EntityClient<unknown, unknown>) => {
      client.destroy();
    });
  }

  const persistanceLoadedPromise = Promise.all(
    Object.values<EntityClient<unknown, unknown>>(entityClients).map((client) => client.persistanceLoaded)
  );

  const firstSyncPromise = Promise.all(
    Object.values<EntityClient<unknown, unknown>>(entityClients).map((client) => client.firstSyncLoaded)
  );

  await Promise.all([persistanceLoadedPromise, firstSyncPromise]);

  mapValues(entityClients, (client: EntityClient<unknown, unknown>) => client.persistanceLoaded);

  return { ...entityClients, destroy };
}
