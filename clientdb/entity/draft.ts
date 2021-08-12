export type EntityDraft<Data> = Data & {
  saveAndReset(): void;
};
