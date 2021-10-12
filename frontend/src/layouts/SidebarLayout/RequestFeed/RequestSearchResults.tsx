import { observer } from "mobx-react";

import { useDb } from "~frontend/clientdb";

import { RequestFeedGroups } from "./RequestFeedGroups";

interface Props {
  searchTerm: string;
}

export const RequestSearchResults = observer(({ searchTerm }: Props) => {
  const db = useDb();
  const topics = db.topic.search(searchTerm);

  return <RequestFeedGroups topics={topics} />;
});
