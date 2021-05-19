import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { HomeView } from "~frontend/views/HomeView";

export default function LandingPage(): JSX.Element {
  return <HomeView />;
}

assignPageLayout(LandingPage, AppLayout);
