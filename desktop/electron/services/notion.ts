import { BrowserWindow } from "electron";

import { Notification, NotificationServiceAdapter, NotificationServiceStatus } from "@aca/desktop/types";

const notionURL = "https://www.notion.so";

let cookies: Electron.Cookie[] | null = null;

export const notionServiceAdapter: NotificationServiceAdapter = {
  needsBackend: false,

  checkStatus: async function (): Promise<NotificationServiceStatus> {
    // TODO: figure out how to do this nicely

    const window = new BrowserWindow({
      width: 0,
      height: 0,
    });

    cookies = await window.webContents.session.cookies.get({
      url: notionURL,
    });
    window.close();

    if (cookies.length === 0) {
      return "no-session";
    }

    // TODO: Add checks that the session is still alive

    return "connected";
  },

  login: async function (): Promise<boolean> {
    if ((await this.checkStatus()) === "connected") {
      return true;
    }

    const window = new BrowserWindow({
      width: 600,
      height: 480,
      webPreferences: {
        contextIsolation: true,
      },
    });

    window.webContents.session.clearStorageData();

    await window.loadURL(notionURL + "/login");
    await new Promise<void>((resolve) => {
      window.webContents.addListener("did-redirect-navigation", () => {
        if (window.webContents.getURL().includes(notionURL)) {
          // assuming we're done with login, whence navigating back to Notion
          resolve();
        }
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cookies = await window.webContents.session.cookies.get({
      url: notionURL,
    });

    window.close();

    return true;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update: function (addFn: (notification: Notification) => void): void {
    throw new Error("Function not implemented.");
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  archive: function (id: string): Promise<void> {
    throw new Error("Function not implemented.");
  },
  openOAuth: function (): Promise<boolean> {
    throw new Error("Function not implemented.");
  },
  sync: async function sync(): Promise<Notification[]> {
    if (!cookies) {
      console.error("unable to sync");
      throw new Error("unable to sync");
    }
    const response = await fetch(notionURL + "/api/v3/getNotificationLog", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: cookies
          .filter((cookie) => cookie.domain?.includes("notion.so"))
          .map((cookie) => cookie.name + "=" + cookie.value)
          .join("; "),
      },
      body: JSON.stringify({
        // Notion uses the space id for tracking within their help-desk
        spaceId: cookies.find((cookie) => cookie.name == "ajs_group_id")?.value,
        size: 20,
        type: "mentions",
      }),
    });
    const value = await response.json();

    const { notificationIds, recordMap } = value;

    const stripDashes = (str: string) => str.replaceAll("-", "");

    return notificationIds
      .map((id: string) => {
        const notification = recordMap.notification[id].value;
        const blockId = notification.navigable_block_id;
        const pageName = recordMap.block[blockId].value.properties.title[0][0];
        switch (notification.type) {
          case "user-invited":
            return {
              service: "notion",
              id,
              title: "You've been invited to page " + pageName,
              path: stripDashes(blockId),
              isUnread: false,
            };

          case "commented": {
            const discussionId = recordMap.activity[notification.activity_id].value.discussion_id;
            return {
              service: "notion",
              id,
              title: "New comment in " + pageName,
              path:
                stripDashes(blockId) +
                "?d=" +
                stripDashes(discussionId) +
                "#" +
                stripDashes(recordMap.discussion[discussionId].value.parent_id),
              isUnread: false,
            };
          }

          default:
            console.warn("Unknown notification type: " + notification.type);
        }
      })
      .filter(Boolean);
  },
};
