import { createAutocompletePlugin } from "~richEditor/autocomplete";
import { EditorMentionData } from "~shared/types/editor";

import { MentionPicker } from "./MentionPicker";
import { TypedMention } from "./TypedMention";

export const userMentionExtension = createAutocompletePlugin<EditorMentionData>({
  type: "mention",
  triggerChar: "@",
  nodeComponent: TypedMention,
  pickerComponent: MentionPicker,
});
