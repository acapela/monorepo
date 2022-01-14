import { createElectronPersistedValue } from "./base/persistance";

export const authTokenBridgeValue = createElectronPersistedValue<string | null>("auth-token", () => null);
