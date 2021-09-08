import { EntityClient } from "./client";
import { EntityDraft } from "./draft";
import { EntitySyncConfig } from "./sync";

interface DefineEntityConfig<Data> {
  type?: Data;
  name: string;
  getCacheKey: (item: Data) => string;
  keyField: keyof Data;
  sync: EntitySyncConfig<Data>;
}

export interface EntityDefinition<Data, Connections> {
  config: DefineEntityConfig<Data>;
  getConnections: EntityDefinitionGetConnections<Data, Connections>;
}

type EntityDefinitionGetConnections<Data, Connections> = (item: Data, manager: GetConnectionsManager) => Connections;

interface GetConnectionsManager {
  getEntity<OtherData, Connections>(
    definition: EntityDefinition<OtherData, Connections>
  ): EntityClient<OtherData, Connections>;
}

export function defineEntity<Data, Connections = {}>(
  config: DefineEntityConfig<Data>,
  getConnections: EntityDefinitionGetConnections<Data, Connections>
): EntityDefinition<Data, Connections> {
  return { config, getConnections };
}
