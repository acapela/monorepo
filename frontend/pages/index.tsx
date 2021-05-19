import { AppLayout } from "~frontend/layouts/AppLayout";
import { RoomList } from "~frontend/rooms/roomList";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { HomeView } from "~frontend/views/HomeView";

export default function LandingPage(): JSX.Element {
  return <HomeView />;
}

assignPageLayout(LandingPage, AppLayout);
