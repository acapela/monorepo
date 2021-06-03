import { routes } from "~frontend/routes";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { SpaceView } from "~frontend/views/SpaceView";

export default function SpacesPage(): JSX.Element {
  const { spaceId } = routes.space.useParams();

  return <SpaceView spaceId={spaceId} />;
}

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(SpacesPage, AppLayout);
