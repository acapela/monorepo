import { Account, AtlassianSite, JiraAccount } from "@aca/db";

type IssueEventTypeName = "issue_assigned";

export type JiraAccountWithAllDetails = JiraAccount & {
  account: Account;
  atlassian_site: AtlassianSite;
};

export interface JiraWebhookCreationResult {
  webhookRegistrationResult: Array<{
    createdWebhookId?: number;
    errors?: string[];
  }>;
}

export type GetResourcesResponse = Array<{
  id: string; // "1324a887-45db-1bf4-1e99-ef0ff456d421",
  name: string; // "Site name",
  url: string; // "https://your-domain.atlassian.net",
  scopes: string[]; // ["read:issue-type:jira", "write:issue-type:jira","read:project:jira"],
  avatarUrl: string; // "https:\/\/site-admin-avatar-cdn.prod.public.atl-paas.net\/avatars\/240\/flag.png"
}>;

export interface GetWatchersResponse {
  self: string; // "https://your-domain.atlassian.net/rest/api/3/issue/EX-1/watchers",
  isWatching: boolean;
  watchCount: number;
  watchers?: Array<{
    self: string; // "https://your-domain.atlassian.net/rest/api/3/user?accountId=5b10a2844c20165700ede21g",
    accountId: string; // "5b10a2844c20165700ede21g",
    displayName: string; //"Mia Krystof",
    active: boolean;
  }>;
}

export type WebhookEvent =
  | "jira:issue_created"
  | "jira:issue_updated"
  | "comment_created"
  | "comment_updated"
  | "issue_property_set";

export interface JiraWebhookPayload {
  issue: {
    id: string;
    self: string; //"https://alepaca.atlassian.net/rest/api/2/10035",
    key: string; //"AL-9",
    fields: Fields;
  };
  comment?: Comment;
  issue_event_type_name: IssueEventTypeName;
  changelog: Changelog;
  webhookEvent: WebhookEvent;
  matchedWebhookIds: number[];
  timestamp: number; // 1646076066182

  // User that created the event
  user?: AtlassianUser;
}

interface Comment {
  self: string; // "https://acapela-team.atlassian.net/rest/api/2/issue/10001/comment/10011",
  id: string; // "10011",
  author: AtlassianUser;
  updateAuthor: AtlassianUser;

  body: string | null; //"huh? naaa naa [~accountid:70121:cb8ddaa4-9bec-41fa-843f-34675d008b41] ",

  created: string; //"2022-03-01T14:19:49.467+0000",
  updated: string; //"2022-03-01T14:22:04.959+0000",
  jsdPublic: boolean; // no idea what this means
}

interface Changelog {
  id: string;
  items: {
    field: string; // "assignee",
    fieldtype: string; //"jira",
    fieldId: string; // "assignee",
    from: null | string; // could be user id"6114e675627b5600688c0b3e",
    fromString: null | string; // "Omar Duarte",
    to: null | string;
    toString: null | string;
    tmpFromAccountId?: null | string;
    tmpToAccountId?: null | string;
  }[];
}

interface AtlassianUser {
  self: string; // "https://alepaca.atlassian.net/rest/api/2/user?accountId=6114e675627b5600688c0b3e",
  accountId: string; //"6114e675627b5600688c0b3e",
  avatarUrls: {
    "48x48": string; //"https://secure.gravatar.com/avatar/80ca835ceec719d9ec5bfd00d5f87620?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FOD-0.png",
    "24x24": string; //"https://secure.gravatar.com/avatar/80ca835ceec719d9ec5bfd00d5f87620?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FOD-0.png",
    "16x16": string; //"https://secure.gravatar.com/avatar/80ca835ceec719d9ec5bfd00d5f87620?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FOD-0.png",
    "32x32": string; //"https://secure.gravatar.com/avatar/80ca835ceec719d9ec5bfd00d5f87620?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FOD-0.png"
  };
  displayName: string; //"Omar Duarte",
  active: boolean;
  timeZone: string; // "Atlantic/Madeira",
  accountType: string; //"atlassian"
}

interface Fields {
  // Important bits

  summary: string; //"this is the issue title";
  creator: AtlassianUser;
  reporter: AtlassianUser;
  description: string | null; //"Jira Issue Description";
  assignee: AtlassianUser | null;

  statuscategorychangedate: string; //"2022-02-28T17:33:34.959+0000";
  status: {
    self: string; //"https://alepaca.atlassian.net/rest/api/2/status/10000";
    description: string; //"";
    iconUrl: string; //"https://alepaca.atlassian.net/";
    name: string; //"To Do";
    id: string; //"10000";
    statusCategory: {
      self: string; //"https://alepaca.atlassian.net/rest/api/2/statuscategory/2";
      id: number; //2;
      key: string; //"new";
      colorName: string; //"blue-gray";
      name: string; //"New";
    };
  };

  watches: {
    self: string; //"https://alepaca.atlassian.net/rest/api/2/issue/AL-9/watchers";
    watchCount: boolean;
    isWatching: boolean;
  };

  issuetype: {
    self: string; //"https://alepaca.atlassian.net/rest/api/2/issuetype/10002";
    id: string; //"10002";
    description: string; //"A small, distinct piece of work.";
    iconUrl: string; //"https://alepaca.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium";
    name: string; //"Task";
    subtask: boolean;
    avatarId: number; //10318;
    hierarchyLevel: number;
  };

  labels: string[];

  // Context

  project: {
    self: string; //"https://alepaca.atlassian.net/rest/api/2/project/10000";
    id: string; //"10000";
    key: string; //"AL";
    name: string; //"Alepaca";
    projectTypeKey: string; //"software";
    simplified: boolean;
    avatarUrls: {
      "48x48": string; //"https://alepaca.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10413";
      "24x24": string; //"https://alepaca.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10413?size=small";
      "16x16": string; //"https://alepaca.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10413?size=xsmall";
      "32x32": string; //"https://alepaca.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10413?size=medium";
    };
  };

  // *** Other

  fixVersions: unknown;

  resolution: unknown;
  resolutiondate: unknown;
  workratio: unknown;

  issuerestriction: {
    issuerestrictions: unknown;
    shouldDisplay: boolean;
  };

  lastViewed: string; //"2022-02-28T19:05:55.714+0000";
  created: string; //"2022-02-28T17:33:34.749+0000";

  // these are unknown things
  customfield_10000: unknown;
  customfield_10001: unknown;
  customfield_10002: unknown;
  customfield_10003: unknown;
  customfield_10004: unknown;
  customfield_10010: unknown;
  customfield_10014: unknown;
  customfield_10015: unknown;

  customfield_10005: unknown;
  customfield_10006: unknown;
  customfield_10007: unknown;

  customfield_10008: unknown;

  customfield_10009: unknown;
  customfield_10016: unknown;
  customfield_10017: unknown;
  customfield_10018: unknown;
  customfield_10019: unknown;
  customfield_10020: unknown;
  customfield_10021: unknown;
  customfield_10022: unknown;
  customfield_10023: unknown;
  customfield_10024: unknown;
  customfield_10025: unknown;
  customfield_10029: unknown;

  priority: {
    self: string; // "https://alepaca.atlassian.net/rest/api/2/priority/3";
    iconUrl: string; //"https://alepaca.atlassian.net/images/icons/priorities/medium.svg";
    name: string; // "Medium";
    id: string; // "3";
  };

  timeestimate: unknown;
  versions: unknown;
  issuelinks: unknown;

  updated: string; //"2022-02-28T19:21:06.179+0000";

  components: unknown;

  security: unknown;
  attachment: unknown;

  subtasks: unknown;

  aggregateprogress: {
    progress: number;
    total: number;
  };
  progress: {
    progress: 0;
    total: 0;
  };

  environment: unknown;
  duedate: unknown;

  votes: {
    self: string; //"https://alepaca.atlassian.net/rest/api/2/issue/AL-9/votes";
    votes: number;
    hasVoted: boolean;
  };

  // Time tracking
  aggregatetimeestimate: unknown;
  timeoriginalestimate: unknown;
  timetracking: unknown;
  aggregatetimeoriginalestimate: unknown;
  timespent: unknown;
  aggregatetimespent: unknown;
}
