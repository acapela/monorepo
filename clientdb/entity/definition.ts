import { AnnotationsMap, IComputedValue } from "mobx";

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
  /**
   * It is possible to define entity level rule deciding if given entity should be 'visible' via public api.
   *
   * This is useful for cases where we have some item locally, but we also manage permissions to see it locally.
   *
   * Aka 'soft permissions'.
   */
  accessValidator?: EntityAccessValidator<Data, Connections>;
  getConnections?: EntityDefinitionGetConnections<Data, Connections>;
  search?: EntitySearchConfig<Data>;
  events?: EntityUserEvents<Data, Connections>;
}

export type EntityUserEvents<Data, Connections> = {
  itemAdded?: (entity: Entity<Data, Connections>, utilities: DatabaseUtilities) => void;
  itemUpdated?: (entity: Entity<Data, Connections>, dataBefore: Data, utilities: DatabaseUtilities) => void;
  itemRemoved?: (entity: Entity<Data, Connections>, utilities: DatabaseUtilities) => void;
};

export interface EntityDefinition<Data, Connections> {
  config: DefineEntityConfig<Data, Connections>;
  getSchemaHash(): string;
  addConnections<AddedConnections>(
    getConnections: EntityDefinitionGetConnections<Data, AddedConnections>
  ): EntityDefinition<Data, AddedConnections>;
  addAccessValidation(accessValidator: EntityAccessValidator<Data, Connections>): EntityDefinition<Data, Connections>;
  addEventHandlers(events: EntityUserEvents<Data, Connections>): EntityDefinition<Data, Connections>;
}

export interface ConnectionsManager<Data> extends DatabaseUtilities {
  createCache<V>(key: string, getter: (data: Data) => V): IComputedValue<V>;
}

type EntityDefinitionGetConnections<Data, Connections> = (item: Data, manager: ConnectionsManager<Data>) => Connections;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EntityDataByDefinition<Def extends EntityDefinition<any, any>> = Def extends EntityDefinition<
  infer Data,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>
  ? Data
  : never;

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
    addEventHandlers(events) {
      return defineEntity({ ...config, events });
    },
  };
}
