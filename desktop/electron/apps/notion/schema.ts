import { z } from "zod";

const Role = z.enum(["read_and_write", "editor", "read"]);

const NotionUserPayload = z.object({
  role: z.string(),
  value: z.object({
    email: z.string(),
    id: z.string(),
    name: z.string(),
    onboarding_completed: z.boolean(),
    profile_photo: z.string(),
    version: z.number(),
  }),
});

const DiscussionPayload = z.object({
  role: z.string(),
  value: z.object({
    comments: z.array(z.string()),
    id: z.string(),
    parent_id: z.string(),
    parent_table: z.string(),
    resolved: z.boolean(),
    space_id: z.string(),
    version: z.number(),
  }),
});

const UserPermission = z.object({
  role: Role,
  type: z.literal("user_permission"),
  user_id: z.string(),
});

const SpaceView = z.object({
  role: Role,
  value: z.object({
    space_id: z.string(),
  }),
});

const SpacePayload = z.object({
  role: Role,
  value: z.object({
    id: z.string(),
    version: z.number(),
    name: z.string(),
    permissions: z.array(UserPermission),
    icon: z.string().optional(),
    pages: z.array(z.string()),
    created_time: z.number(),
    last_edited_time: z.number(),
    created_by_table: z.string(), //e.g. notion_user
    created_by_id: z.string(),
    last_edited_by_table: z.string(), //e.g. notion_user
    last_edited_by_id: z.string(),
    plan_type: z.string(), //e.g. team
    invite_link_enabled: z.boolean(),
  }),
});

export const Notification = z.object({
  id: z.string(),
  version: z.number(),
  user_id: z.string(),
  activity_id: z.string(),
  received: z.boolean(),
  read: z.boolean(),
  emailed: z.boolean(),
  invalid: z.boolean(),
  visited: z.boolean(),
  space_id: z.string(),
  navigable_block_id: z.string().optional(),
  collection_id: z.string().optional(),
  end_time: z.string(),
  type: z.enum(["user-mentioned", "commented", "user-invited", "reminder"]),
  channel: z.string(),
});

const NotificationPayload = z.object({
  role: z.string(),
  value: Notification,
});

const NotionUserId = z.string();
const NotionSpaceId = z.string();
const NotionBlockId = z.string();

export const NotionBlockDSLDataIndicator = "‣";
export const NotionUserDataIndicator = "u";
export const NotionPageReferenceDataIndicator = "p";
export const NotionDateDataIndicator = "d";
const BlockTextItem = z.tuple([z.string()]);
const BlockMentionItem = z.tuple([
  z.literal(NotionBlockDSLDataIndicator),
  z.tuple([z.tuple([z.literal(NotionUserDataIndicator), NotionUserId])]),
]);
const BlockPageReferenceItem = z.tuple([
  z.literal(NotionBlockDSLDataIndicator),
  z.tuple([z.tuple([z.literal(NotionPageReferenceDataIndicator), NotionBlockId, NotionSpaceId])]),
]);
const BlockDateItem = z.tuple([
  z.literal(NotionBlockDSLDataIndicator),
  z.tuple([
    z.tuple([
      z.literal(NotionDateDataIndicator),
      z.object({
        start_date: z.string(), //e.g. 2022-02-12
        end_date: z.string().optional(), //e.g. 2022-02-12
        start_time: z.string().optional(), //e.g. 00:15
        end_time: z.string().optional(), //e.g. 23:59
        time_zone: z.string().optional(), //e.g. Pacific/Honolulu
      }),
    ]),
  ]),
]);
export const BlockDataItem = z.union([BlockTextItem, BlockMentionItem, BlockPageReferenceItem, BlockDateItem]);

const BlockValueCommon = z.object({
  id: z.string(),
  version: z.number(),
  space_id: z.string(),
  parent_id: z.string(),
  parent_table: z.string(),
  last_edited_time: z.number(),
  last_edited_by_id: z.string(),
  last_edited_by_table: z.string(),
});

export const SomeBlockValue = z.object({ properties: z.record(z.array(BlockDataItem)) });

export const CollectionViewPageBlockValue = BlockValueCommon.extend({
  type: z.literal("collection_view_page"),
  alive: z.boolean(),
  collection_id: z.string(),
  created_by_id: z.string(),
  created_by_table: z.string(),
  created_time: z.number(),
  format: z.object({
    collection_pointer: z.object({
      id: z.string(),
      spaceId: z.string(),
      table: z.literal("collection"),
    }),
  }),
  view_ids: z.array(z.string()),
});

const BlockPayload = <T>(type: z.ZodType<T>) => z.object({ role: z.string(), value: type });

const CollectionPayload = z.object({
  role: z.string(),
  value: z
    .object({
      id: z.string(),
      version: z.number(),
      name: z.array(z.array(z.string())), //[["Maybe a Collection"]],
      schema: z.unknown(),
      parent_id: z.string(),
      parent_table: z.string(), //"block",
      alive: z.boolean(),
      migrated: z.boolean(),
      space_id: z.string(),
    })
    .optional(),
});

const CommonCommentActivityEdit = z.object({
  authors: z.array(z.object({ id: z.string() })),
  comment_id: z.string(),
  discussion_id: z.string(),
  navigable_block_id: z.string().optional(),
  space_id: z.string(),
  timestamp: z.number(),
});

const ActivityCommentEditData = z.object({
  id: z.string(),
  text: z.array(BlockDataItem),
  alive: z.boolean(),
  version: z.number(),
  space_id: z.string(),
  parent_id: z.string(),
  created_time: z.number(),
  parent_table: z.string(), //e.g. discussion
  created_by_id: z.string(),
  created_by_table: z.string(), //e.g. notion_user
  last_edited_time: z.number(),
});

const CommentCreatedActivityEdit = CommonCommentActivityEdit.extend({
  type: z.literal("comment-created"),
  comment_data: ActivityCommentEditData,
});

const CommentChangedActivityEdit = CommonCommentActivityEdit.extend({
  type: z.literal("comment-changed"),
  comment_data: z.object({
    after: ActivityCommentEditData,
    before: ActivityCommentEditData,
  }),
});

const ActivityEdit = z.union([
  CommentCreatedActivityEdit,
  CommentChangedActivityEdit,
  z.object({ authors: z.array(z.object({ id: z.string() })) }),
]);

const ActivityValueCommon = z.object({
  id: z.string(),
  context_id: z.string(),
  edits: z.array(ActivityEdit),
  end_time: z.string(),

  in_log: z.boolean(),
  index: z.number(),
  invalid: z.boolean(),

  navigable_block_id: z.string().optional(),
  parent_id: z.string(),
  parent_table: z.string(),
  shard_id: z.number(),
  space_id: z.string(),
  start_time: z.string(),
  version: z.number(),
});

export const UserInvitedActivityValue = ActivityValueCommon.extend({
  type: z.literal("user-invited"),
  invited_user_id: z.string(),
});

export const CommentedActivityValue = ActivityValueCommon.extend({
  type: z.literal("commented"),
  discussion_id: z.string(),
});

export const UserMentionedActivityValue = ActivityValueCommon.extend({
  type: z.literal("user-mentioned"),
  mentioned_block_id: z.string(),
  mentioned_property: z.string(),
  mentioned_user_id: z.string(),
});

export const ActivityPayload = z.object({
  role: z.string(),
  value: z
    .discriminatedUnion("type", [UserInvitedActivityValue, CommentedActivityValue, UserMentionedActivityValue])
    .optional(),
});

export const GetSpacesResult = z.record(
  z.object({
    __version__: z.number().optional(),
    notion_user: z.record(NotionUserPayload),
    user_root: z.unknown(),
    user_settings: z.unknown(),
    space_view: z.record(SpaceView),
    space: z.record(SpacePayload),
    block: z.unknown().optional(),
    collection: z.unknown(),
  })
);

export const GetPublicSpaceDataResult = z.object({
  results: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      // A lot of properties ignored
    })
  ),
});

export const RecordMap = z
  .object({
    __version__: z.number().optional(),
    notification: z.record(NotificationPayload),
    block: z.record(BlockPayload(z.unknown())),
    activity: z.record(ActivityPayload),
    notion_user: z.record(NotionUserPayload),
    discussion: z.record(DiscussionPayload),
    collection: z.record(CollectionPayload),
  })
  .partial();

export const GetNotificationLogResult = z.object({
  notificationIds: z.array(z.string()), // uuids
  recordMap: RecordMap,
});
