import { makeAutoObservable } from "mobx";

import { CommandMenuSession } from "./session";

export const commandMenuStore = makeAutoObservable({
  session: null as CommandMenuSession | null,
});
