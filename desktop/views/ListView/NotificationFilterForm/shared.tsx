import { Draft } from "immer";

import { InnerNotificationFilter } from "@aca/desktop/clientdb/notification/filter";

export type ProduceFiltersUpdate = (fn: (filter: Draft<InnerNotificationFilter[]>) => void) => void;

export type IntegrationFilterFormProps = {
  filters: InnerNotificationFilter[];
  produceFiltersUpdate: ProduceFiltersUpdate;
};
