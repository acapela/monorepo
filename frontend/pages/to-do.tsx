import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { ToDoView } from "~frontend/views/ToDoView";

export default function ToDoPage(): JSX.Element {
  return <ToDoView />;
}

assignPageLayout(ToDoPage, AppLayout);
