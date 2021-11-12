import { compact, get, isArray, isString, isUndefined } from "lodash";
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

function renderNodes(node: RichEditorNode | undefined | RichEditorNode[], context: GenerateContext = {}): string {
  if (isArray(node)) return toString(node.map((n) => renderNode(n, context)));
  return renderNode(node, context);
}

function createBlockquote(text: string): string {
  return Md.blockquote(" " + text);
}

function renderList(
  content: RichEditorNode[] | undefined,
  context: GenerateContext = {},
  startCounter?: number
): string {
  if (!content) return "";
  const listItems = compact(
    content.map((n) => {
      if (n.type !== "listItem") return;
      return removeEndingNewline(renderNodes(n.content, context));
    })
  );
  if (isUndefined(startCounter)) return Md.listBullet(listItems) + "\n";
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let counter = startCounter!;
  return listItems.map((item) => `${counter++}. ${item}`).join("\n") + "\n";
}

function renderNode(node: RichEditorNode | undefined, context: GenerateContext = {}): string {
  if (!node) return "";
  switch (node.type) {
    case "paragraph":
      return renderNodes(node.content, context) + "\n";
    case "text":
      return renderTextNode(node);
    case "emoji":
      return Md.emoji(get(node.attrs, "data.name"));
    case "blockquote":
      return createBlockquote(renderNodes(node.content, context));
    case "mention":
      // eslint-disable-next-line no-case-declarations
      const userId = get(node.attrs, "data.userId");
      if (context.mentionedSlackIdByUsersId && context.mentionedSlackIdByUsersId[userId]) {
        return createSlackLink(`@${context.mentionedSlackIdByUsersId[userId]}`);
      }
      return createSlackLink("@unknown");
    case "bulletList":
      return renderList(node.content, context);
    case "orderedList":
      return renderList(node.content, context, get(node.attrs, "start", 1));
  }
  return "";
}

function removeEndingNewline(input: string): string {
  if (input.endsWith("\n")) return input.slice(0, -1);
  return input;
}

export type GenerateContext = {
  mentionedSlackIdByUsersId?: {
    [userId: string]: string;
  };
};

export function generateMarkdownFromTipTapJson(root: RichEditorNode, context: GenerateContext = {}): string {
  // don't render if no root doc element
  if (root.type !== "doc") return "";
  return removeEndingNewline(renderNodes(root.content, context));
}
