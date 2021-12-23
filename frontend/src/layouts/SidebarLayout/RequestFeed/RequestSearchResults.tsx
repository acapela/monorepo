import { uniq } from "lodash";
import { observer } from "mobx-react";

import { useDb } from "~frontend/clientdb";
import { isNotNullish } from "~shared/nullish";

import { RequestFeedGroups } from "./RequestFeedGroups/RequestFeedGroups";

interface Props {
  searchTerm: string;
}

export const RequestSearchResults = observer(({ searchTerm }: Props) => {
  const db = useDb();
  const topics = db.topic.search(searchTerm);
  const messages = db.message.search(searchTerm);

  const allFoundTopics = uniq([...topics, ...messages.map((message) => message.topic)]).filter(isNotNullish);

  return <RequestFeedGroups topics={allFoundTopics} showAll />;
});
