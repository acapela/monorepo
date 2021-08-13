import { EntityDefinition } from "./definition";
import { EntityClient } from "./client";
import { createEntityDraft, EntityDraft } from "./draft";
import { EntitySyncConfig } from "./sync";
import { makeAutoObservable } from "mobx";
import { EntitiesConnectionsConfig } from "./entitiesConnections";

export type Entity<Data> = Data & {
  createDraft(): EntityDraft<Data>;
  clone(): Entity<Data>;
};

export function createEntity<D, C>(
  data: D,
  definition: EntityDefinition<D, C>,
  { getEntityClientByDefinition }: EntitiesConnectionsConfig
): Entity<D & C> {
  const { config, getConnections } = definition;

  const connections = getConnections(data, {
    getEntity: getEntityClientByDefinition,
  });

  const dataAndConnections: D & C = { ...data, ...connections };

  const entity: Entity<D & C> = makeAutoObservable({
    ...dataAndConnections,
    clone() {
      throw "un";
    },
    createDraft() {
      return createEntityDraft(entity, () => {
        throw "un";
      });
    },
  });

  return entity;
}
