import { BrowserWindow } from "electron";
import { makeObservable, observable } from "mobx";

export const appState = makeObservable(
  {
    mainWindow: null as null | BrowserWindow,
  },
  {
    mainWindow: observable.ref,
  }
);
