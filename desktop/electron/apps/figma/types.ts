export interface FigmaSessionState {
  error: boolean;
  status: number;
  meta: {
    user_realtime_token: string;
  };
}

export interface FigmaSocketMessage {
  method: "post" | "put" | unknown;
  type: "user_notification" | unknown;
  parent_org_id: unknown;
  user_notification?: FigmaUserNotification;
}

export interface FigmaUserNotification {
  id: string;
  user_id: string;
  view: number;
  locals: FigmaCommentNotification | unknown;
  read_at: string | null; //date iso string
  created_at: string; //date iso string
  resolved_at: string | null; //date iso string
  rejected_at: string | null; //date iso string
  community_profile_id: unknown;
  space_id: unknown;
  cursor_id: unknown;
  parent_org_id: unknown;
}

interface FigmaUser {
  id: string;
  handle: string; // name of user, e.g. Clark Kent
  img_url: string;
}

export interface FigmaCommentMessageMeta {
  user_id?: string;
  user_annotated?: FigmaUser;
  t: string; //message text payload
}

interface FigmaComment {
  id: string;
  message_meta: FigmaCommentMessageMeta[];
  user: FigmaUser;
}

interface FigmaFile {
  key: string;
  name: string; //title of file
  folder_id: string | null;
  team_id: string | null;
  thumbnail_url: string | null;
}

export interface FigmaCommentNotification {
  file_key: string; //a-zA-Z0-9 value
  parent_org_id: unknown;
  comment_id: string;
  comment_parent_id: string | null;
  thumbnail_url: string;
  thumbnail_status: unknown; //
  user_id: string; //from user_id
  from: FigmaUser;
  prototype: boolean;
  comment: FigmaComment;
  open_url: string;
  reply_url: string;
  parent_comment: FigmaComment | null;
  file: FigmaFile;
}

export interface GetFigmaUserNotificationsResponse {
  error: boolean;
  status: number;
  meta: {
    feed: FigmaUserNotification[];
    users: Record<string, FigmaUser>;
    // There's many other properties that are ignored...
  };
  i18n: null;
}
