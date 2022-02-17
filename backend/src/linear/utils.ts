import { LinearClient } from "@linear/sdk";
import { get, map } from "lodash";

import { IssueData } from "@aca/backend/src/linear/types";
import { LinearOauthToken, db } from "@aca/db";

export function getRandomLinearClient(usersForOrg: LinearOauthToken[]): LinearClient {
  // pick a random token to access linear api
  const randomUserToken = usersForOrg[Math.floor(usersForOrg.length * Math.random())].access_token;
  return new LinearClient({
    accessToken: randomUserToken,
  });
}

export async function getUsersForOrganizationId(id: string, userIds?: string[]): Promise<LinearOauthToken[]> {
  return db.linear_oauth_token.findMany({
    where: {
      linear_organization_id: id,
      ...(userIds
        ? {
            linear_user_id: {
              in: userIds,
            },
          }
        : {}),
    },
  });
}

export interface IssueHistory {
  actor: User | null;
  source: Source | null;
  toAssignee: User | null;
  toState: ToState | null;
  archived: boolean | null;
  autoArchived: boolean;
  autoClosed: boolean;
  trashed: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string | null;
  name: string;
}
export interface Source {
  name: string;
  type: string;
}

export interface ToState {
  type: string;
}

export async function fetchCreatorAndIssueHistory(
  linearClient: LinearClient,
  id: string
): Promise<[User, IssueHistory[]]> {
  const historyRes = await linearClient.client.rawRequest(
    `
query Issue($id: String!) {
  issue(id: $id) {
    creator {
      id
      name
    }
    history(first: 5, orderBy: updatedAt) {
      edges {
        node {
          actor {
            id
            name
          }
          source
          toAssignee {
            id
            name
          }
          toState {
            type
          }
          archived
          autoArchived
          autoClosed
          trashed
          createdAt
          updatedAt
        }
      }
    }
  }
}
`,
    { id: id }
  );
  if (historyRes.status != 200) {
    throw new Error(`linear api request error: ${historyRes.status}`);
  }
  return [
    get(historyRes.data, "issue.creator", null) as User,
    map(get(historyRes.data, "issue.history.edges", []), "node") as IssueHistory[],
  ];
}

export type NotificationOrigin = "assign" | "cancel";

export function findMatchingActor(
  origin: NotificationOrigin,
  issueData: IssueData,
  creator: User,
  issueHistory: IssueHistory[]
): User {
  let h: IssueHistory | undefined;
  if (origin === "assign") {
    h = issueHistory.find((h) => h.toAssignee?.id === issueData.assigneeId);
    // the issue was just created, and we have no history yet
    if (!h) return creator;
  }
  if (origin === "cancel") h = issueHistory.find((h) => h.toState?.type === "canceled");
  return (
    h?.actor || {
      id: null,
      name: h?.source?.name || "Unknown",
    }
  );
}
