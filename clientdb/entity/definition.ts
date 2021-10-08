import { AnnotationsMap } from "mobx";

import { getHash } from "~shared/hash";

import { DatabaseUtilities } from "./entitiesConnections";
import { SortResult } from "./query";
import { EntitySyncConfig } from "./sync";

interface DefineEntityConfig<Data> {
  name: string;
  keys: Array<keyof Data>;
  keyField: keyof Data;
  updatedAtField: keyof Data;
  uniqueIndexes?: Array<keyof Data>;
  getIsDeleted?: (item: Data) => boolean;
  getDefaultValues?: (utilities: DatabaseUtilities) => Partial<Data>;
  sync: EntitySyncConfig<Data>;
  defaultSort?: (item: Data) => SortResult;
  customObservableAnnotations?: AnnotationsMap<Data, never>;
}

export interface EntityDefinition<Data, Connections> {
  config: DefineEntityConfig<Data>;
  getSchemaHash(): string;
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
    // Schema hash is used to determine if data shape changed and full reload is needed
    getSchemaHash() {
      const sortedKeys = [...config.keys].sort();
      return getHash(sortedKeys.join(""));
    },
    getConnections,
    addConnections<AddedConnections>(getConnections: EntityDefinitionGetConnections<Data, AddedConnections>) {
      return defineEntity(config, getConnections) as EntityDefinition<Data, AddedConnections>;
    },
  };
}
