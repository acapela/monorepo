import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { RoomList } from "~frontend/rooms/roomList";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { LoginView } from "~frontend/views/LoginView";

export default function LandingPage(): JSX.Element {
  const user = useCurrentUser();

  if (!user) {
    return <LoginView />;
  }

  return <RoomList />;
}

assignPageLayout(LandingPage, AppLayout);
