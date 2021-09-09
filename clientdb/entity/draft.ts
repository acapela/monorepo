import { Entity } from "./entity";

export type EntityDraft<Data> = Data & {
  saveAndReset(): void;
};

export function createEntityDraft<Data, Connections>(
  entity: Entity<Data, Connections>,
  onSave: (draft: EntityDraft<Data>) => void
): EntityDraft<Data> {
  const draft = entity.clone() as unknown as EntityDraft<Data>;

  draft.saveAndReset = () => {
    onSave(draft);
  };

  return draft;
}
