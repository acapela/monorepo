export type GetSpacesResult = Record<
  string,
  {
    __version__: number;
    notion_user: Record<string, NotionUserPayload>;
    user_root: unknown;
    user_settings: unknown;
    space_view: Record<string, SpaceView>;
    space: Record<string, SpacePayload>;
    block: unknown;
    collection: unknown;
  }
>;

interface SpaceView {
  role: Role;
  value: {
    space_id: string;
  };
}

interface SpacePayload {
  role: Role;
  value: {
    id: string;
    version: number;
    name: string;
    permissions: UserPermission[];
    email_domains: string[];
    icon: string;
    beta_enabled: boolean;
    pages: string[];
    created_time: number;
    last_edited_time: number;
    created_by_table: string; //e.g. notion_user
    created_by_id: string;
    last_edited_by_table: string; //e.g. notion_user
    last_edited_by_id: string;
    plan_type: string; //e.g. team
    invite_link_enabled: boolean;
  };
}

type Role = "read_and_write" | "editor" | "read";

export interface UserPermission {
  role: Role;
  type: "user_permission";
  user_id: string;
}

export interface GetPublicSpaceDataResult {
  results: {
    id: string;
    name: string;
    // A lot of properties ignored
  }[];
}

export interface GetNotificationLogResult {
  notificationIds: string[]; // uuids
  recordMap: {
    __version__: number;
    notification: Record<string, NotificationPayload>;
    block: Record<string, BlockPayload<BlockType>>;
    activity: Record<string, ActivityPayload<ActivityType>>;
    discussion: Record<string, DiscussionPayload>;
    notion_user: Record<string, NotionUserPayload>;
    collection?: Record<string, CollectionPayload>;
  };
}

type NotificationPayloadType = "user-mentioned" | "commented" | "user-invited" | "reminder";

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
type BlockType = "page" | "collection_view_page" | unknown;

export type BlockPayload<T extends BlockType> = {
  role: string;
  value: BlockValue<T>;
};

interface BlockValueCommon<T extends BlockType> {
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

export interface PageBlockValue extends BlockValueCommon<"page"> {
  alive: boolean;
  content: string[];
  created_by_id: string;
  created_by_table: string;
  created_time: number;
  format: unknown;
  last_edited_by: string;

  properties: {
    title: BlockDataItem[];
    [key: string]: unknown;
  };
}

export interface CollectionViewPageBlockValue extends BlockValueCommon<"collection_view_page"> {
  alive: boolean;
  collection_id: string;
  created_by_id: string;
  created_by_table: string;
  created_time: number;

  format: {
    collection_pointer: {
      id: string;
      spaceId: string;
      table: "collection";
    };
  };

  view_ids: string[];
}

export type BlockValue<T extends BlockType> = T extends "page"
  ? PageBlockValue
  : T extends "collection_view_page"
  ? CollectionViewPageBlockValue
  : BlockValueCommon<unknown>;

export interface CollectionPayload {
  role: string;
  value: {
    id: string;
    version: number;
    name: Array<string[]>; //[["Maybe a Collection"]],
    schema: unknown;
    parent_id: string;
    parent_table: string; //"block",
    alive: boolean;
    migrated: boolean;
    space_id: string;
  };
}

export interface ActivityPayload<T extends ActivityType> {
  role: string;
  value: ActivityValue<T>;
}

type ActivityType = "user-invited" | "commented" | "user-mentioned" | unknown;

interface ActivityValueCommon<T extends ActivityType> {
  id: string;
  type: T;
  context_id: string;
  edits: ActivityEdit<T>[];
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

type ActivityEdit<T extends ActivityType> = T extends "commented"
  ? CommentCreatedActivityEdit | CommentChangedActivityEdit
  : {
      authors: {
        id: string;
      };
    };

type CommentEditedDataType = "comment-created" | "comment-changed";

interface CommonCommentActivityEdit<T extends CommentEditedDataType> {
  authors: {
    id: string;
  }[];
  comment_id: string;
  discussion_id: string;
  navigable_block_id: string;
  space_id: string;
  timestamp: number;
  type: T;
}

export interface ActivityCommentEditData {
  id: string;
  text: BlockDataItem[];
  alive: boolean;
  version: number;
  space_id: string;
  parent_id: string;
  created_time: number;
  parent_table: string; //e.g. discussion
  created_by_id: string;
  created_by_table: string; //e.g. notion_user
  last_edited_time: number;
}

interface CommentCreatedActivityEdit extends CommonCommentActivityEdit<"comment-created"> {
  comment_data: ActivityCommentEditData;
}

interface CommentChangedActivityEdit extends CommonCommentActivityEdit<"comment-changed"> {
  comment_data: {
    after: ActivityCommentEditData;
    before: ActivityCommentEditData;
  };
}

type NotionUserId = string;
type NotionSpaceId = string;
type NotionBlockId = string;

export const NotionBlockDSLDataIndicator = "‣";
export const NotionUserDataIndicator = "u";
export const NotionPageReferenceDataIndicator = "p";
export const NotionDateDataIndicator = "d";
export type BlockDataItem = BlockTextItem | BlockMentionItem | BlockPageReferenceItem | BlockDateItem;
export type BlockTextItem = [string];
export type BlockMentionItem = [typeof NotionBlockDSLDataIndicator, [[typeof NotionUserDataIndicator, NotionUserId]]];
export type BlockPageReferenceItem = [
  typeof NotionBlockDSLDataIndicator,
  [[typeof NotionPageReferenceDataIndicator, NotionBlockId, NotionSpaceId]]
];
export type BlockDateItem = [
  typeof NotionBlockDSLDataIndicator,
  [
    [
      typeof NotionDateDataIndicator,
      {
        start_date: string; //e.g. 2022-02-12
        end_date?: string; //e.g. 2022-02-12
        start_time?: string; //e.g. 00:15
        end_time?: string; //e.g. 23:59
        time_zone?: string; //e.g. Pacific/Honolulu
      }
    ]
  ]
];

interface UserInvitedActivityValue extends ActivityValueCommon<"user-invited"> {
  invited_user_id: string;
}

export interface CommentedActivityValue extends ActivityValueCommon<"commented"> {
  discussion_id: string;
}

export interface UserMentionedActivityValue extends ActivityValueCommon<"user-mentioned"> {
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
