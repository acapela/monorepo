import { ElectronPublishedAPI } from "./electron/preload";

declare module "*.png" {
  const img: string;

  export default img;
}

declare global {
  interface Window {
    electronBridge: ElectronPublishedAPI;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    onUsersnapCXLoad: (api: any) => void;
  }
}
