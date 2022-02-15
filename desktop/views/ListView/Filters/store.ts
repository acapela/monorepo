import { makeAutoObservable } from "mobx";

import { NotificationFilter } from "@aca/desktop/clientdb/list";

export const filtersEditStore = makeAutoObservable({
  editedFilter: null as NotificationFilter | null,
});
