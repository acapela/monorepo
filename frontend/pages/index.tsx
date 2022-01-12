import { SidebarLayout } from "@aca/frontend/layouts/SidebarLayout";
import { assignPageLayout } from "@aca/frontend/utils/pageLayout";
import { InboxView } from "@aca/frontend/views/InboxView";

export default function InboxPage() {
  return <InboxView />;
}

assignPageLayout(InboxPage, SidebarLayout);
