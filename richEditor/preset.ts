import StarterKit from "@tiptap/starter-kit";
import { Links } from "./links/autolinks";

import { Extensions } from "@tiptap/react";
import { userMentionExtension } from "~frontend/message/extensions/mentions";

/**
 * Let's have definition of extensions shared as it's used both by editor and message html renderer.
 */
export const richEditorExtensions: Extensions = [
  // Starter kit includes all basic extensions for rich editor
  StarterKit.configure({ horizontalRule: false, gapcursor: false }),
  // Autolinks
  Links,

  userMentionExtension,
];
