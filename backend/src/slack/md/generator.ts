import { compact, get, isArray, isString, isUndefined } from "lodash";
import { Md } from "slack-block-builder";

import { db } from "~db";
import { RichEditorNode } from "~richEditor/content/types";
import { isNotNullish } from "~shared/nullish";

import { createSlackLink } from "./utils";

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
      return Md.bold(text);
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
    case "mention": {
      const userId = get(node.attrs, "data.userId");
      if (context.mentionedSlackIdByUsersId && context.mentionedSlackIdByUsersId[userId]) {
        const slackMentionCtx = context.mentionedSlackIdByUsersId[userId];
        if ("slackId" in slackMentionCtx) return createSlackLink(`@${slackMentionCtx.slackId}`);
        if ("name" in slackMentionCtx) return Md.bold(`@${slackMentionCtx.name}`);
      }
      return Md.bold("@unknown");
    }
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

export type SlackMentionContext =
  | {
      slackId: string;
    }
  | {
      name: string;
    };

export type GenerateContext = {
  rootNodesLimit?: number;
  mentionedSlackIdByUsersId?: {
    [userId: string]: SlackMentionContext;
  };
};

export function generateMarkdownFromTipTapJson(root: RichEditorNode | null, context: GenerateContext = {}): string {
  if (!root) return "";
  // don't render if no root doc element
  if (root.type !== "doc") return "";

  const contentNodesToRender = context.rootNodesLimit ? root.content?.slice(0, context.rootNodesLimit) : root.content;
  return removeEndingNewline(renderNodes(contentNodesToRender, context));
}

/**
 * To prepare slack markdown from message, we need map of our user id <> slack user id.
 *
 * This function prepares such map for any message
 */
async function createSlackUsersContextForMessage(messageId: string): Promise<GenerateContext | null> {
  // Get message, doing joins all the way to team member slack info.
  const mentionsInfo = await db.message.findFirst({
    where: { id: messageId },
    include: {
      topic: {
        include: {
          team: {
            include: {
              team_member: {
                include: {
                  user: true,
                  team_member_slack: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!mentionsInfo) return null;

  const userIdToSlackIdEntries = mentionsInfo.topic.team.team_member
    .map((member): [userId: string, context: SlackMentionContext] => {
      const userId = member.user_id;
      const slackUserId = member.team_member_slack?.slack_user_id;

      if (!slackUserId) {
        return [userId, { name: member.user.name }];
      }

      return [userId, { slackId: slackUserId }];
    })
    .filter(isNotNullish);

  const mentionedSlackIdByUsersId = Object.fromEntries(userIdToSlackIdEntries);

  return {
    mentionedSlackIdByUsersId,
  };
}

export async function generateSlackMarkdownFromMessage(messageContent: RichEditorNode, messageId: string) {
  const slackMentionsContext = await createSlackUsersContextForMessage(messageId);

  return generateMarkdownFromTipTapJson(messageContent, { ...slackMentionsContext });
}

export async function generateSlackMarkdownSnippetFromMessage(messageContent: RichEditorNode, messageId: string) {
  const slackMentionsContext = await createSlackUsersContextForMessage(messageId);

  return generateMarkdownFromTipTapJson(messageContent, { ...slackMentionsContext, rootNodesLimit: 1 });
}
