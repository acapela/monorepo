import { BrowserWindow } from "electron";

import { Notification, NotificationServiceAdapter, NotificationServiceStatus } from "@aca/desktop/types";

const notionURL = "https://www.notion.so";

let cookies: Electron.Cookie[] | null = null;

export const notionServiceAdapter: NotificationServiceAdapter = {
  needsBackend: false,

  checkStatus: function (): Promise<NotificationServiceStatus> {
    throw new Error("Function not implemented.");
  },

  login: async function (): Promise<boolean> {
    const window = new BrowserWindow({
      width: 600,
      height: 480,
      webPreferences: {
        contextIsolation: true,
      },
    });

    await window.loadURL(notionURL + "/login");
    await new Promise<void>((resolve) =>
      window.webContents.addListener("did-navigate", () => {
        if (window.webContents.getURL().includes(notionURL)) {
          // assuming we're done with login, whence navigating back to Notion
          resolve();
        }
      })
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cookies = await window.webContents.session.cookies.get({
      url: notionURL,
    });

    window.close();

    return true;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sync: function (addFn: (notification: Notification) => void): void {
    throw new Error("Function not implemented.");
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  archive: function (id: string): Promise<void> {
    throw new Error("Function not implemented.");
  },
  openOAuth: function (): Promise<boolean> {
    throw new Error("Function not implemented.");
  },
};
