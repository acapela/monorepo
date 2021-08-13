import { typedKeys } from "~shared/object";
import { createEntityClient, EntityClient, GetEntityClientByDefinition } from "./entity/client";
import { LocalDbAdapter } from "./entity/db/adapter";
import { EntityDefinition } from "./entity/definition";
import { EntitiesConnectionsConfig } from "./entity/entitiesConnections";
import { EntitiesMap } from "./entity/entitiesMap";

export * from "./entity/index";

interface ClientDbConfig {
  dbAdapter?: LocalDbAdapter;
}

type ClientDb<Entities extends EntitiesMap> = {
  [key in keyof Entities]: EntityClient<Entities[key]>;
};

export function createClientDb<Entities extends EntitiesMap>(
  config: ClientDbConfig,
  entitiesMap: Entities
): ClientDb<Entities> {
  const clientdb: ClientDb<Entities> = {} as ClientDb<Entities>;

  const definitionClientMap = new Map<EntityDefinition<any, any>, EntityClient<any>>();

  const entitiesConnectionConfig: EntitiesConnectionsConfig = {
    getEntityClientByDefinition<Data, Connections>(
      definition: EntityDefinition<Data, Connections>
    ): EntityClient<Data & Connections> {
      const client = definitionClientMap.get(definition);

      if (!client) {
        throw new Error("no client for given definition in this db");
      }

      return client;
    },
  };

  typedKeys(entitiesMap).forEach((entityKey) => {
    const definition = entitiesMap[entityKey];
    const entityClient = createEntityClient(definition, entitiesConnectionConfig);

    definitionClientMap.set(definition, entityClient);

    clientdb[entityKey] = entityClient;
  });

  return clientdb;
}
