import { createAutocompletePlugin } from "@aca/richEditor/autocomplete";
import { EditorRequestLinkData, RICH_EDIOTR_REQUEST_LINK_TYPE } from "@aca/shared/types/editor";

import { RequestLinkNode } from "./RequestLinkNode";
import { RequestPicker } from "./RequestPicker";

export const requestLinkExtension = createAutocompletePlugin<EditorRequestLinkData>({
  type: RICH_EDIOTR_REQUEST_LINK_TYPE,
  triggerChar: "#",
  nodeComponent: RequestLinkNode,
  pickerComponent: RequestPicker,
});
