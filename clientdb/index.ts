import { find, forEach, mapValues } from "lodash";

import { typedKeys } from "~shared/object";

import { EntityClient, EntityClientByDefinition, createEntityClient } from "./entity/client";
import { DbContext, DbContextInstance } from "./entity/context";
import { ClientAdapterConfig, DbEntityInfo } from "./entity/db/adapter";
import { EntityDefinition } from "./entity/definition";
import { DatabaseUtilities } from "./entity/entitiesConnections";
import { EntitiesMap } from "./entity/entitiesMap";

export * from "./entity/index";

interface ClientDbConfig {
  db?: ClientAdapterConfig;
  contexts?: DbContextInstance<unknown>[];
}

type EntitiesClientsMap<Entities extends EntitiesMap> = {
  [key in keyof Entities]: EntityClientByDefinition<Entities[key]>;
};

type ClientDbLoadingInfo = {
  persistanceLoadedPromise: Promise<void>;
  firstSyncPromise: Promise<void>;
};

type ClientDbExtra = {
  destroy: () => void;
  loadingInfo: ClientDbLoadingInfo;
};

type ClientDb<Entities extends EntitiesMap> = ClientDbExtra & EntitiesClientsMap<Entities>;

export function createClientDb<Entities extends EntitiesMap>(
  { db, contexts }: ClientDbConfig,
  entitiesMap: Entities
): ClientDb<Entities> {
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

  const entityClients = mapValues(entitiesMap, (definition) => {
    const entityClient = createEntityClient(definition, {
      databaseUtilities: databaseUtilities,
      dbAdapterConfig: db,
    });

    return entityClient;
  }) as EntitiesClientsMap<Entities>;

  if (db && typeof window !== "undefined") {
    const entitiesInfo = typedKeys(entitiesMap).map((entityName): DbEntityInfo => {
      const definition = entitiesMap[entityName];
      return { name: definition.config.name, keyField: definition.config.keyField as string };
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dbInitializePromise = db.dbAdapter.initialize({
      dbPrefix: db.dbPrefix,
      dbVersion: db.dbVersion,
      entities: entitiesInfo,
    });
  }

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

  mapValues(entityClients, (client: EntityClient<unknown, unknown>) => client.persistanceLoaded);

  const loadingInfo: ClientDbLoadingInfo = {
    persistanceLoadedPromise: persistanceLoadedPromise.then(() => void 0),
    firstSyncPromise: firstSyncPromise.then(() => void 0),
  };

  return { ...entityClients, destroy, loadingInfo };
}
