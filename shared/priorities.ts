import { upperFirst } from "lodash";

export const getLabelForPriority = (priority: string) => upperFirst(priority);
