import { makeAutoObservable } from "mobx";

import { NotificationFilter } from "./types";

export const filtersEditStore = makeAutoObservable({
  editedFilter: null as NotificationFilter | null,
});
