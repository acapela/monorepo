import React from "react";

import { PageMeta } from "~frontend/utils/PageMeta";
import { NewRequestView } from "~frontend/views/NewRequestView";

export default function NewRequestPage(): JSX.Element {
  return (
    <>
      <PageMeta title="New Request" />
      <NewRequestView />
    </>
  );
}
