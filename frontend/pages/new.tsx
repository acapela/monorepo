import React from "react";

import { SidebarLayout } from "~frontend/layouts/SidebarLayout";
import { PageMeta } from "~frontend/utils/PageMeta";
import { NewRequestView } from "~frontend/views/NewRequestView";

export default function NewRequestPage(): JSX.Element {
  return (
    <>
      <PageMeta title="New Request" />
      <SidebarLayout>
        <NewRequestView />
      </SidebarLayout>
    </>
  );
}
