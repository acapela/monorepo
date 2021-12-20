import { RichEditorNodeTypedNode } from "~richEditor/content/types";

import { MentionType } from "./mention";

export interface EditorMentionData<T = MentionType> {
  userId: string;
  type: T;
}

export const RICH_EDIOTR_REQUEST_LINK_TYPE = "request-link";

export interface EditorRequestLinkData {
  requestId: string;
}

export type EditorRequestLinkNode = RichEditorNodeTypedNode<
  { data: EditorRequestLinkData },
  typeof RICH_EDIOTR_REQUEST_LINK_TYPE
>;
