import gql from "graphql-tag";

import { withFragments } from "~frontend/gql/utils";

const fragments = {
  task: gql`
    fragment DashboardTaskCard_task on task {
      id
      user_id
      message {
        id
        content
        user_id
        topic {
          id
          name
        }
      }
      created_at
    }
  `,
};

export const DashboardTaskCard = withFragments(fragments, function DashboardTaskCard() {
  return <div>elo</div>;
});
