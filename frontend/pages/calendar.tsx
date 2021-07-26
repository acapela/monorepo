import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { PageMeta } from "~frontend/utils/PageMeta";
import { CalendarView } from "~frontend/views/CalendarView";
import { Container } from "~ui/layout/Container";

export default function CalendarPage(): JSX.Element {
  return (
    <>
      <PageMeta title="Calendar" />
      <Container>
        <CalendarView />
      </Container>
    </>
  );
}

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(CalendarPage, AppLayout);
