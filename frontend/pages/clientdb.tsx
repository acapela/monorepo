import { observer } from "mobx-react";

import { useDb } from "~frontend/clientdb";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { HomeView } from "~frontend/views/HomeView";

const ClientDbPlayground = observer(function ClientDbPlayground(): JSX.Element {
  const db = useDb();
  return (
    <div>
      <div>
        Topics
        <div>
          {db.topic.all.map((topic) => {
            return (
              <div
                key={topic.id}
                onClick={() => {
                  const newName = prompt("name") ?? topic.name;

                  topic.update({ name: newName });
                }}
              >
                {topic.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default ClientDbPlayground;

assignPageLayout(ClientDbPlayground, AppLayout);
