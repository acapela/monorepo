import { emojiAutocompleteExtension } from "./emoji";
import { userMentionExtension } from "./mentions";
import { requestLinkExtension } from "./requestLink";

/**
 * List of frontend related rich editor extensions used both to edit and display messages.
 */
export const messageComposerExtensions = [userMentionExtension, emojiAutocompleteExtension, requestLinkExtension];
