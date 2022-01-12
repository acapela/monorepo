import { createStoreContext } from "@aca/shared/sharedState";

interface CreatingNewTopicInfo {
  enabled: boolean;
  duplicateFromTopicId?: string;
}

interface AppState {
  creatingNewTopic: CreatingNewTopicInfo | null;
}

export const [
  AppStateStoreProvider,
  _,
  // asserted one
  useAppStateStore,
] = createStoreContext<AppState>(() => ({
  creatingNewTopic: null,
}));
