import { RichEditorNodeTypedNode } from "~richEditor/content/types";

import { MentionType } from "./mention";

export interface EditorMentionData<T = MentionType> {
  userId: string;
  type: T;
}

export const RICH_EDIOTR_REQUEST_LINK_TYPE = "request-link";

export interface EditorRequestLinkData {
  /**
   * In case someone has no access to topic - show original name to be able to display meaningful tip about
   * lack of access
   */
  originalTopicName: string;
  requestId: string;
}

export type EditorRequestLinkNode = RichEditorNodeTypedNode<
  { data: EditorRequestLinkData },
  typeof RICH_EDIOTR_REQUEST_LINK_TYPE
>;
