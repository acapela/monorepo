import { db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { logger } from "@aca/shared/logger";

import { getIssueWatchers, jiraRequest } from "../rest";
import { GetWatchersResponse, JiraAccountWithAllDetails } from "../types";

export const EXTRACT_MENTIONED_ACCOUNT_REGEX = /\[~accountid:([a-zA-Z0-9\-:]+)\]/gim;

export function extractMentionedAccountIds(text: string | null) {
  if (!text) {
    return [];
  }

  const result = [];

  for (const match of text.matchAll(EXTRACT_MENTIONED_ACCOUNT_REGEX)) {
    // match[0] = "[~accountid:70121:cb8ddaa4-9bec-41fa-843f-34675d008b41]"
    // match[1] = "70121:cb8ddaa4-9bec-41fa-843f-34675d008b41"
    if (match[1]) {
      result.push(match[1]);
    }
  }
  return result;
}

export async function getWatchers(jiraAccount: JiraAccountWithAllDetails, issueKey: string) {
  const response = await jiraRequest(jiraAccount, getIssueWatchers(issueKey));

  if (!response) {
    return [];
  }

  const watchers = response.data as GetWatchersResponse;

  return watchers?.watchers?.map((w) => w.accountId) ?? [];
}

export async function getLeastRecentlyUsedAtlassianAccount(
  atlassianCloudUrl: string
): Promise<JiraAccountWithAllDetails> {
  const jiraAccount = await db.jira_account.findFirst({
    where: {
      atlassian_site: {
        url: atlassianCloudUrl,
      },
    },
    orderBy: {
      rest_req_last_used_at: "asc",
    },
    include: {
      account: true,
      atlassian_site: true,
    },
  });

  assert(jiraAccount, "jira account not found for atlassianCloudUrl " + atlassianCloudUrl, logger.error.bind(logger));

  return jiraAccount;
}
