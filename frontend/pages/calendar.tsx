import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { CalendarView } from "~frontend/views/CalendarView";
import { Container } from "~ui/layout/Container";

export default function CalendarPage(): JSX.Element {
  return (
    <Container>
      <CalendarView />
    </Container>
  );
}

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(CalendarPage, AppLayout);
