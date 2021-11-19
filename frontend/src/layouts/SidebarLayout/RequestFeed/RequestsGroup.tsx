import { TopicEntity } from "~frontend/clientdb/topic";

export interface RequestsGroupProps {
  topics: TopicEntity[];
  groupName: string;
}
