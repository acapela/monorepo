import { typedKeys } from "~shared/object";

import {
  EntityClient,
  EntityClientByDefinition,
  GetEntityClientByDefinition,
  createEntityClient,
} from "./entity/client";
import { DbContext, DbContextInstance } from "./entity/context";
import { ClientAdapterConfig, DbEntityInfo, LocalDbAdapter } from "./entity/db/adapter";
import { EntityDefinition } from "./entity/definition";
import { DatabaseUtilities } from "./entity/entitiesConnections";
import { EntitiesMap } from "./entity/entitiesMap";

export * from "./entity/index";

interface ClientDbConfig {
  db?: ClientAdapterConfig;
  contexts?: DbContextInstance<unknown>[];
}

type ClientDb<Entities extends EntitiesMap> = {
  [key in keyof Entities]: EntityClientByDefinition<Entities[key]>;
};

export function createClientDb<Entities extends EntitiesMap>(
  { db, contexts }: ClientDbConfig,
  entitiesMap: Entities
): ClientDb<Entities> {
  const clientdb: ClientDb<Entities> = {} as ClientDb<Entities>;

  const definitionClientMap = new Map<EntityDefinition<any, any>, EntityClient<any, any>>();

  const databaseUtilities: DatabaseUtilities = {
    getEntity<Data, Connections>(definition: EntityDefinition<Data, Connections>): EntityClient<Data, Connections> {
      const client = definitionClientMap.get(definition);

      if (!client) {
        throw new Error("no client for given definition in this db");
      }

      return client;
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

  typedKeys(entitiesMap).forEach((entityKey) => {
    const definition = entitiesMap[entityKey];
    const entityClient = createEntityClient(definition, {
      databaseUtilities: databaseUtilities,
      dbAdapterConfig: db,
    });

    definitionClientMap.set(definition, entityClient);

    entityClient;

    clientdb[entityKey] = entityClient;
  });

  if (db && typeof window !== "undefined") {
    const entitiesInfo = typedKeys(entitiesMap).map((entityName): DbEntityInfo => {
      const definition = entitiesMap[entityName];
      return { name: definition.config.name, keyField: definition.config.keyField as string };
    });
    const dbInitializePromise = db.dbAdapter.initialize({
      dbPrefix: db.dbPrefix,
      dbVersion: db.dbVersion,
      entities: entitiesInfo,
    });
  }

  return clientdb;
}
