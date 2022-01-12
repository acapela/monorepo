import { createAutocompletePlugin } from "@aca/richEditor/autocomplete";
import { EditorMentionData } from "@aca/shared/types/editor";

import { MentionPicker } from "./MentionPicker";
import { TypedMention } from "./TypedMention";

export const userMentionExtension = createAutocompletePlugin<EditorMentionData>({
  type: "mention",
  triggerChar: "@",
  nodeComponent: TypedMention,
  pickerComponent: MentionPicker,
});
