import { EntityDraft } from "./draft";
import { EntitySyncConfig } from "./sync";

export type Entity<Data> = Data & {
  createDraft(): EntityDraft<Data>;
};

interface DefineEntityConfig<Data> {
  type?: Data;
  name: string;
  getCacheKey: (item: Data) => string;
  sync: EntitySyncConfig<Data>;
}

export interface EntityDefinition<Data> {
  config: DefineEntityConfig<Data>;
}

export function defineEntity<Data, Connections = {}>(
  config: DefineEntityConfig<Data>,
  getConnections: (item: Data) => Connections
): EntityDefinition<Data & Connections> {}
