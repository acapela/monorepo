export type CommonWebhook = {
  action: "create" | "update" | "remove";
  createdAt: Date;
  url: string;
  organizationId: string;
};

export type IssueState = {
  id: string;
  name: string;
  color: string;
  type: string;
};

export type IssueTeam = {
  id: string;
  name: string;
  key: string;
};

export type IssueData = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  number: number;
  title: string;
  priority: number;
  boardOrder: number;
  sortOrder: number;
  teamId: string;
  previousIdentifiers: string[];
  creatorId: string;
  stateId: string;
  priorityLabel: string;
  subscriberIds: string[];
  labelIds: string[];
  state: IssueState;
  team: IssueTeam;
};

export type IssueWebhook = {
  type: "Issue";
  data: IssueData;
} & CommonWebhook;

export type CommentIssue = {
  id: string;
  title: string;
};

export type CommentUser = {
  id: string;
  name: string;
};

export type CommentData = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  issueId: string;
  userId: string;
  issue: CommentIssue;
  user: CommentUser;
};

export type CommentWebhook = {
  type: "Comment";
  data: CommentData;
} & CommonWebhook;

export type Webhook = IssueWebhook | CommentWebhook;
