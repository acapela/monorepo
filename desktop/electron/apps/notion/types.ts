export interface GetNotificationLogResult {
  notificationIds: string[]; // uuids
  recordMap: {
    __version__: number;
    notification: Record<string, NotificationPayload>;
    block: Record<string, BlockPayload<BlockType>>;
    activity: Record<string, ActivityPayload<ActivityType>>;
    discussion: Record<string, DiscussionPayload>;
    notion_user: Record<string, NotionUserPayload>;
  };
}

type NotificationPayloadType = "user-mentioned" | "commented" | "user-invited";

export interface NotificationPayload {
  role: string;
  value: {
    id: string;
    version: number;
    user_id: string;
    activity_id: string;
    received: boolean;
    read: boolean;
    emailed: boolean;
    invalid: boolean;
    visited: boolean;
    space_id: string;
    navigable_block_id: string;
    collection_id: string;
    end_time: string;
    type: NotificationPayloadType;
    channel: string;
  };
}
type BlockType = "page" | unknown;

export type BlockPayload<T extends BlockType> = {
  role: string;
  value: BlockValue<T>;
};

interface BlockValueCommon<T extends BlockType = "page"> {
  id: string;
  version: number;
  type: T;
  space_id: string;
  parent_id: string;
  parent_table: string;
  last_edited_time: number;
  last_edited_by_id: string;
  last_edited_by_table: string;
}

interface PageBlockValue extends BlockValueCommon<"page"> {
  alive: boolean;
  content: string[];
  created_by_id: string;
  created_by_table: string;
  created_time: number;
  format: unknown;
  last_edited_by: string;

  properties: {
    title: Array<string[]>;
  };
}

export type BlockValue<T extends BlockType> = T extends "page" ? PageBlockValue : BlockValueCommon<unknown>;

export interface ActivityPayload<T extends ActivityType> {
  role: string;
  value: ActivityValue<T>;
}

type ActivityType = "user-invited" | "commented" | "user-mentioned" | unknown;

interface ActivityValueCommon<T extends ActivityType> {
  id: string;
  type: T;
  context_id: string;
  edits: {
    authors: {
      id: string;
    }[];
  }[];
  end_time: string;

  in_log: boolean;
  index: number;
  invalid: boolean;

  navigable_block_id: string;
  parent_id: string;
  parent_table: string;
  shard_id: number;
  space_id: string;
  start_time: string;
  version: number;
}

interface UserInvitedActivityValue extends ActivityValueCommon<"user-invited"> {
  invited_user_id: string;
}

interface CommentedActivityValue extends ActivityValueCommon<"commented"> {
  discussion_id: string;
}

interface UserMentionedActivityValue extends ActivityValueCommon<"user-mentioned"> {
  mentioned_block_id: string;
  mentioned_property: string;
  mentioned_user_id: string;
}

export type ActivityValue<T extends ActivityType> = T extends "user-invited"
  ? UserInvitedActivityValue
  : T extends "commented"
  ? CommentedActivityValue
  : T extends "user-mentioned"
  ? UserMentionedActivityValue
  : unknown;

interface DiscussionPayload {
  role: string;
  value: {
    comments: string[];
    context?: unknown[];
    id: string;
    parent_id: string;
    parent_table: string;
    resolved: boolean;
    space_id: string;
    version: number;
  };
}

interface NotionUserPayload {
  role: string;
  value: {
    email: string;
    id: string;
    mobile_onboarding_completed: boolean;
    name: string;
    onboarding_completed: boolean;
    profile_photo: string;
    version: number;
  };
}
