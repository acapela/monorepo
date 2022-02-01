export type WorkerService = "notion" | "figma";

export interface ServiceSyncController {
  serviceName: WorkerService;
  onWindowFocus: () => void;
  onWindowBlur: () => void;
  forceSync: () => void;
}
