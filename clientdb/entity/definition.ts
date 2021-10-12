import { AnnotationsMap } from "mobx";

import { Entity } from "~clientdb";
import { getHash } from "~shared/hash";

import { DatabaseUtilities } from "./entitiesConnections";
import { SortResult } from "./query";
import { EntitySearchConfig } from "./search";
import { EntitySyncConfig } from "./sync";

type EntityAccessValidator<Data, Connections> = (
  entity: Entity<Data, Connections>,
  utilities: DatabaseUtilities
) => boolean;

interface DefineEntityConfig<Data, Connections> {
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
  accessValidator?: EntityAccessValidator<Data, Connections>;
  getConnections?: EntityDefinitionGetConnections<Data, Connections>;
  search?: EntitySearchConfig<Data>;
}

export interface EntityDefinition<Data, Connections> {
  config: DefineEntityConfig<Data, Connections>;
  getSchemaHash(): string;
  addConnections<AddedConnections>(
    getConnections: EntityDefinitionGetConnections<Data, AddedConnections>
  ): EntityDefinition<Data, AddedConnections>;
  addAccessValidation(accessValidator: EntityAccessValidator<Data, Connections>): EntityDefinition<Data, Connections>;
}

type EntityDefinitionGetConnections<Data, Connections> = (item: Data, manager: DatabaseUtilities) => Connections;

export function defineEntity<Data, Connections = {}>(
  config: DefineEntityConfig<Data, Connections>
): EntityDefinition<Data, Connections> {
  return {
    config,

    // Schema hash is used to determine if data shape changed and full reload is needed
    getSchemaHash() {
      const sortedKeys = [...config.keys].sort();
      return getHash(sortedKeys.join(""));
    },
    addConnections<AddedConnections>(getConnections: EntityDefinitionGetConnections<Data, AddedConnections>) {
      return defineEntity<Data, AddedConnections>({ ...config, getConnections } as DefineEntityConfig<
        Data,
        AddedConnections
      >) as EntityDefinition<Data, AddedConnections>;
    },
    addAccessValidation(validator) {
      return defineEntity({ ...config, accessValidator: validator });
    },
  };
}
