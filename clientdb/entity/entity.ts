import { makeAutoObservable } from "mobx";
import { typedKeys } from "~shared/object";
import { EntityDefinition } from "./definition";
import { createEntityDraft, EntityDraft } from "./draft";
import { EntitiesConnectionsConfig } from "./entitiesConnections";

export type Entity<Data, Connections> = Data &
  Connections & {
    createDraft(): EntityDraft<Data>;
    clone(): Entity<Data, Connections>;
    update(data: Partial<Data>): void;
  };

export type EntityFromDefinition<Def extends EntityDefinition<any, any>> = Def extends EntityDefinition<
  infer Data,
  infer Connections
>
  ? Entity<Data, Connections>
  : never;

export function createEntity<D, C>(
  data: D,
  definition: EntityDefinition<D, C>,
  { getEntityClientByDefinition }: EntitiesConnectionsConfig
): Entity<D, C> {
  const { config, getConnections } = definition;

  const connections = getConnections(data, {
    getEntity: getEntityClientByDefinition,
  });

  const dataAndConnections: D & C = { ...data, ...connections };

  const entity: Entity<D, C> = makeAutoObservable({
    ...dataAndConnections,
    clone() {
      throw "un";
    },
    update(input) {
      typedKeys(input).forEach((keyToUpdate) => {
        const value = input[keyToUpdate];

        if (value === undefined) return;

        (entity as D)[keyToUpdate] = value as D[keyof D];
      });
    },
    createDraft() {
      return createEntityDraft(entity, () => {
        throw "un";
      });
    },
  });

  return entity;
}
