import { makeAutoObservable, observable } from "mobx";

import { NotificationFilter } from "@aca/desktop/clientdb/list";

export const filtersEditStore = makeAutoObservable(
  {
    editedFilter: null as NotificationFilter | null,
  },
  { editedFilter: observable.ref }
);
