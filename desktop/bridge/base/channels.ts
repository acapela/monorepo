/**
 * Important note!
 *
 * TLDR: Don't import any runtime thing from electron in this file. This file is imported both by electron and client
 *
 * Utils here allows creating type-safe bridge between electron and client.
 * Those are only bridges - meaning they're not implementing any handling of given bridge events.
 *
 *
 */

import { serializeUntracked } from "@aca/shared/mobx/utils";

export type ElectronChannelSubscriber<T> = (data: T, event: ElectronChannelEventUnified<T>) => void;
export type ElectronSubscribeCleanup = () => void;

interface ElectronChannelEventUnified<T> {
  reply: (data: T) => void;
}

/**
 * Creates bridge channel that can be subscribed on from both sides.
 */
export function createChannelBridge<Data>(key: string) {
  function subscribe(subscriber: ElectronChannelSubscriber<Data>) {
    if (process.env.ELECTRON_CONTEXT === "client") {
      return window.electronBridge.subscribe(key, subscriber);
    } else {
      return global.electronGlobal.subscribe(key, subscriber);
    }
  }

  /**
   * Allows sending messages from client to electron.
   *
   */
  function send(data: Data) {
    try {
      const sendableData = serializeUntracked(data);
      if (process.env.ELECTRON_CONTEXT === "client") {
        return window.electronBridge.send(key, sendableData);
      } else {
        global.electronGlobal.BrowserWindow.getAllWindows().forEach((targetWindow) => {
          targetWindow.webContents.send(key, sendableData);

          targetWindow.getBrowserViews().forEach((view) => {
            view.webContents.send(key, sendableData);
          });
        });
      }
    } catch (error) {
      console.info(`Failed to send message for channel ${key}`, { data });
      throw error;
    }
  }

  function sendSync(data: Data) {
    try {
      const sendableData = serializeUntracked(data);
      if (process.env.ELECTRON_CONTEXT === "client") {
        return window.electronBridge.sendSync(key, sendableData);
      } else {
        global.electronGlobal.BrowserWindow.getAllWindows().forEach((targetWindow) => {
          targetWindow.webContents.send(key, sendableData);

          targetWindow.getBrowserViews().forEach((view) => {
            view.webContents.send(key, sendableData);
          });
        });
      }
    } catch (error) {
      console.info(`Failed to send message for channel ${key}`, { data });
      throw error;
    }
  }

  return {
    subscribe,
    send,
    sendSync,
  };
}
