import { SidebarLayout } from "~frontend/layouts/SidebarLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { InboxView } from "~frontend/views/InboxView";

export default function InboxPage() {
  return <InboxView />;
}

assignPageLayout(InboxPage, SidebarLayout);
