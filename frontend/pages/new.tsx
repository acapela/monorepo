import React from "react";

import { NewRequestView } from "~frontend/ping-pong/NewRequestView";
import { PageMeta } from "~frontend/utils/PageMeta";

export default function NewRequestPage(): JSX.Element {
  return (
    <>
      <PageMeta title="New Request" />
      <NewRequestView />
    </>
  );
}
