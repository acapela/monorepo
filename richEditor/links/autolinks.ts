import { markInputRule } from "@tiptap/core";
import { InputRule, inputRules } from "prosemirror-inputrules";
import { MarkType } from "prosemirror-model";
import { Link } from "./link";

// These are almost the same as pasteRegex and pasteRegexWithBrackets but with
// additional [\s\n] at the end so they apply after adding white space or a new line
export const linkInputRegex =
  /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}\b(?:[-a-zA-Z0-9@:%._+~#=?!&/]*)(?:[-a-zA-Z0-9@:%._+~#=?!&/]*))[\s\n]$/gi;
export const linkInputRegexWithBrackets =
  /(?:\()https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}\b(?:[-a-zA-Z0-9@:%._+~#=?!&/()]*)(?:\))[\s\n]$/gi;

// eslint-disable-next-line @typescript-eslint/ban-types
function markInputRuleKeepTrailingChar(regexp: RegExp, markType: MarkType, getAttributes?: Function): InputRule {
  // version of markInputRule that adds the missing trailing char
  const standardMarkInputRule = markInputRule(regexp, markType, getAttributes);
  return new InputRule(regexp, (state, match, start, end) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tr = (standardMarkInputRule as any).handler(state, match, start, end);
    if (tr) {
      // If the mark has been applied add the trailing char at the end of the edit
      tr.insertText(match[0].slice(-1), end);
    }
    return tr;
  });
}

export const Links = Link.extend({
  addProseMirrorPlugins() {
    const rules = [
      markInputRuleKeepTrailingChar(linkInputRegex, this.type, (match: string[]) => {
        return { href: match[1] };
      }),
      markInputRuleKeepTrailingChar(linkInputRegexWithBrackets, this.type, (match: string[]) => {
        return { href: match[1] };
      }),
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plugin: any = inputRules({ rules });
    const run = plugin.props.handleTextInput;
    // Add 'enter'/newline support to input rule - Based on:
    // https://discuss.prosemirror.net/t/trigger-inputrule-on-enter/1118/5
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugin.props.handleKeyDown = (view: any, event: any) => {
      if (event.key !== "Enter") return false;
      const { $cursor } = view.state.selection;
      if ($cursor) return run(view, $cursor.pos, $cursor.pos, "\n");
      return false;
    };
    return [plugin];
  },
});
