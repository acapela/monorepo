import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { DashboardView } from "~frontend/views/DashboardView/DashboardView";

export default function DashboardPage() {
  return <DashboardView />;
}

assignPageLayout(DashboardPage, AppLayout);
