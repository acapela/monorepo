import { get, isArray, isString } from "lodash";
import { Md } from "slack-block-builder";

import { createSlackLink } from "~backend/src/notifications/sendNotification";
import { RichEditorNode } from "~richEditor/content/types";

function toString(input: string | string[] | undefined): string {
  if (!input) return "";
  if (isString(input)) return input;
  return input.join("");
}

function renderLink(url: string, name: string): string {
  if (!url.startsWith("https://app.slack.com")) return createSlackLink(url, name);
  const slackRe = /^https:\/\/app.slack.com\/client\/(.+)\/([UC].+)$/.exec(url);
  if (!slackRe || slackRe.length !== 3) return createSlackLink(url, name);
  const slackId = slackRe[2];
  let prefix = "";
  if (slackId.startsWith("U")) prefix = "@";
  if (slackId.startsWith("C")) prefix = "#";
  if (name.startsWith(prefix)) name = name.substr(1);
  return createSlackLink(prefix + slackId, name);
}

function renderSlackMention(text: string): string {
  switch (text) {
    case "@here":
      return "<!here>";
    case "@channel":
      return "<!channel>";
    case "@everyone":
      return "<!everyone>";
  }
  return Md.bold(text);
}

function renderTextNode(node: RichEditorNode): string {
  const text = toString(node.text);
  if (!node.marks) return text;
  const markType = get(node.marks, "[0].type");
  switch (markType) {
    case "link":
      return renderLink(get(node.marks, "[0].attrs.href", ""), text);
    case "code":
      return Md.codeInline(text);
    case "bold":
      return renderSlackMention(text);
    case "italic":
      return Md.italic(text);
    case "strike":
      return Md.strike(text);
  }
  return text;
}

function renderNodes(node: RichEditorNode | undefined | RichEditorNode[]): string {
  if (isArray(node)) return toString(node.map((n) => renderNode(n)));
  return renderNode(node);
}

function createBlockquote(text: string): string {
  return Md.blockquote(" " + text);
}

function renderNode(node: RichEditorNode | undefined): string {
  if (!node) return "";
  switch (node.type) {
    case "paragraph":
      return renderNodes(node.content) + "\n";
    case "text":
      return renderTextNode(node);
    case "emoji":
      return Md.emoji(get(node.attrs, "data.name"));
    case "blockquote":
      return createBlockquote(renderNodes(node.content));
  }
  return "";
}

export function generateMarkdownFromTipTapJson(root: RichEditorNode): string {
  // don't render if no root doc element
  if (root.type !== "doc") return "";
  let text = renderNodes(root.content);
  if (text.endsWith("\n")) text = text.slice(0, -1);
  return text;
}
