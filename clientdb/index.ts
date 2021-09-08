import { typedKeys } from "~shared/object";

import {
  EntityClient,
  EntityClientFromDefinition,
  GetEntityClientByDefinition,
  createEntityClient,
} from "./entity/client";
import { ClientAdapterConfig, DbEntityInfo, LocalDbAdapter } from "./entity/db/adapter";
import { EntityDefinition } from "./entity/definition";
import { EntitiesConnectionsConfig } from "./entity/entitiesConnections";
import { EntitiesMap } from "./entity/entitiesMap";

export * from "./entity/index";

interface ClientDbConfig {
  db?: ClientAdapterConfig;
  //
}

type ClientDb<Entities extends EntitiesMap> = {
  [key in keyof Entities]: EntityClientFromDefinition<Entities[key]>;
};

export function createClientDb<Entities extends EntitiesMap>(
  { db }: ClientDbConfig,
  entitiesMap: Entities
): ClientDb<Entities> {
  const clientdb: ClientDb<Entities> = {} as ClientDb<Entities>;

  const definitionClientMap = new Map<EntityDefinition<any, any>, EntityClient<any, any>>();

  const entitiesConnectionConfig: EntitiesConnectionsConfig = {
    getEntityClientByDefinition<Data, Connections>(
      definition: EntityDefinition<Data, Connections>
    ): EntityClient<Data, Connections> {
      const client = definitionClientMap.get(definition);

      if (!client) {
        throw new Error("no client for given definition in this db");
      }

      return client;
    },
  };

  typedKeys(entitiesMap).forEach((entityKey) => {
    const definition = entitiesMap[entityKey];
    const entityClient = createEntityClient(definition, {
      connectionsConfig: entitiesConnectionConfig,
      dbAdapterConfig: db,
    });

    definitionClientMap.set(definition, entityClient);

    clientdb[entityKey] = entityClient;
  });

  if (db && typeof window !== "undefined") {
    const entitiesInfo = typedKeys(entitiesMap).map((entityName): DbEntityInfo => {
      const definition = entitiesMap[entityName];
      return { name: definition.config.name, keyField: definition.config.keyField as string };
    });
    db.dbAdapter.initialize({ dbPrefix: db.dbPrefix, dbVersion: db.dbVersion, entities: entitiesInfo });
  }

  return clientdb;
}
