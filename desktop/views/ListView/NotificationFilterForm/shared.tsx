import { Draft } from "immer";

import { NotificationFilter } from "@aca/desktop/clientdb/notification/list";

export type ProduceFiltersUpdate = (fn: (filter: Draft<NotificationFilter[]>) => void) => void;

export type IntegrationFilterFormProps = {
  filters: NotificationFilter[];
  produceFiltersUpdate: ProduceFiltersUpdate;
};
