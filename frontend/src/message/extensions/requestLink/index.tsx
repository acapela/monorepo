import { createAutocompletePlugin } from "~richEditor/autocomplete";
import { EditorRequestLinkData } from "~shared/types/editor";

import { RequestLinkNode } from "./RequestLinkNode";
import { RequestPicker } from "./RequestPicker";

export const requestLinkExtension = createAutocompletePlugin<EditorRequestLinkData>({
  type: "request-link",
  triggerChar: "#",
  nodeComponent: RequestLinkNode,
  pickerComponent: RequestPicker,
});
