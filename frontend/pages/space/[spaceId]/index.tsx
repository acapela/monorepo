import { routes } from "~frontend/router";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { SpaceView } from "~frontend/views/SpaceView";

export default function SpacesPage(): JSX.Element {
  const params = routes.space.useAssertParams();

  const { spaceId } = params.route;

  return <SpaceView spaceId={spaceId} />;
}

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(SpacesPage, AppLayout);
