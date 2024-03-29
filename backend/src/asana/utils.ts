import Asana from "asana";

export function createClient() {
  return Asana.Client.create({
    clientId: process.env.ASANA_CLIENT_ID,
    clientSecret: process.env.ASANA_CLIENT_SECRET,
    redirectUri: `${process.env.FRONTEND_URL}/api/backend/v1/asana/callback`,
    defaultHeaders: {
      // this header is required to suppress deprecation warnings
      // https://forum.asana.com/t/update-on-our-planned-api-changes-to-user-task-lists-a-k-a-my-tasks/103828
      "Asana-Enable": "new_user_task_lists,new_project_templates",
    },
  });
}
