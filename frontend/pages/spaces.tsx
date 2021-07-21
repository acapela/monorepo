import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { PageMeta } from "~frontend/utils/PageMeta";
import { SpacesView } from "~frontend/views/SpacesView";

export default function SpacesPage(): JSX.Element {
  return (
    <>
      <PageMeta title="Spaces" />
      <SpacesView />
    </>
  );
}

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(SpacesPage, AppLayout);
