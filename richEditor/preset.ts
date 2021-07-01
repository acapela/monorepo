import StarterKit from "@tiptap/starter-kit";
import { Links } from "./links/autolinks";

import { Foo } from "./autocomplete/foo";
import { MentionTest } from "./autocomplete/mention";
import { Extensions } from "@tiptap/react";

/**
 * Let's have definition of extensions shared as it's used both by editor and message html renderer.
 */
export const richEditorExtensions: Extensions = [
  // Starter kit includes all basic extensions for rich editor
  StarterKit.configure({ horizontalRule: false, gapcursor: false }),
  // Autolinks
  Links,
  Foo,
  MentionTest,
];
