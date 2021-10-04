import { DatabaseUtilities } from "./entitiesConnections";
import { SortResult } from "./query";
import { EntitySyncConfig } from "./sync";

interface DefineEntityConfig<Data> {
  name: string;
  keys?: Array<keyof Data>;
  keyField: keyof Data;
  updatedAtField: keyof Data;
  getIsDeleted?: (item: Data) => boolean;
  getDefaultValues?: (utilities: DatabaseUtilities) => Partial<Data>;
  sync: EntitySyncConfig<Data>;
  defaultSort?: (item: Data) => SortResult;
}

export interface EntityDefinition<Data, Connections> {
  config: DefineEntityConfig<Data>;
  getConnections?: EntityDefinitionGetConnections<Data, Connections>;
  addConnections<AddedConnections>(
    getConnections: EntityDefinitionGetConnections<Data, AddedConnections>
  ): EntityDefinition<Data, Connections & AddedConnections>;
}

type EntityDefinitionGetConnections<Data, Connections> = (item: Data, manager: DatabaseUtilities) => Connections;

export function defineEntity<Data, Connections = {}>(
  config: DefineEntityConfig<Data>,
  getConnections?: EntityDefinitionGetConnections<Data, Connections>
): EntityDefinition<Data, {}> {
  return {
    config,
    getConnections,
    addConnections<AddedConnections>(getConnections: EntityDefinitionGetConnections<Data, AddedConnections>) {
      return defineEntity(config, getConnections) as EntityDefinition<Data, AddedConnections>;
    },
  };
}
