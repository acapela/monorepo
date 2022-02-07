import { compact, isArray, isString } from "lodash";
import markdown from "simple-markdown";

import { MENTION_TYPE_KEY } from "@aca/shared/editor/mentions";
import emojis from "@aca/shared/emoji/slugs.json";
import { swapPlainObjectKeysWithValues } from "@aca/shared/object";
import { EditorMentionData } from "@aca/shared/types/editor";

const emojiNameToEmoji: Record<string, string> = swapPlainObjectKeysWithValues(emojis);

// The rules have been imported from
// https://github.com/Sorunome/slack-markdown/blob/be564c166edd7887fcc44b6ebd12723bb3fe149f/index.js
// Copyright 2021 Sorunome
// Apache License 2.0

const rules = {
  emoji: {
    order: markdown.defaultRules.strong.order,
    match: (source: string) => /^:(\w+):/.exec(source),
    parse: (capture: markdown.Capture) => {
      return {
        content: capture[1],
      };
    },
  },
  blockQuote: Object.assign({}, markdown.defaultRules.blockQuote, {
    match: (source: string, state: markdown.State, prevSource: string) =>
      !/^$|\n *$/.test(prevSource) || state.inQuote ? null : /^( *> [^\n]*(\n *> [^\n]*)*\n?)/.exec(source),
    parse: (capture: markdown.Capture, parse: markdown.Parser, state: markdown.State) => {
      const all = capture[0];
      const removeSyntaxRegex = /^ *> ?/gm;
      const content = all.replace(removeSyntaxRegex, "");

      state.inQuote = true;
      state.inline = true;
      const parsed = parse(content, state);
      state.inQuote = state.inQuote || false;
      state.inline = state.inline || false;

      return {
        content: parsed,
        type: "blockQuote",
      };
    },
  }),
  text: Object.assign({}, markdown.defaultRules.text, {
    match: (source: string) => /^[\s\S]+?(?=[^0-9A-Za-z\s\u00c0-\uffff-]|\n\n|\n|\w+:\S|$)/.exec(source),
  }),
  codeBlock: Object.assign({}, markdown.defaultRules.codeBlock, {
    match: markdown.inlineRegex(/^```([^]+?`*)\n*```/i),
    parse: (capture: markdown.Capture, parse: markdown.Parser, state: markdown.State) => {
      return {
        content: capture[1] || "",
        inQuote: state.inQuote || false,
      };
    },
  }),
  newline: markdown.defaultRules.newline,
  autolink: Object.assign({}, markdown.defaultRules.autolink, {
    order: markdown.defaultRules.url.order + 1,
    match: (source: string) => /^<((?:https?:\/\/|mailto:)[^|>]+)(\|([^>]*))?>/.exec(source),
    parse: (capture: markdown.Capture, parse: markdown.Parser, state: markdown.State) => {
      const content = capture[3]
        ? parse(capture[3], state)
        : [
            {
              type: "text",
              content: capture[1],
            },
          ];
      return {
        content,
        target: capture[1],
      };
    },
  }),
  url: Object.assign({}, markdown.defaultRules.url, {
    parse: (capture: markdown.Capture) => {
      return {
        content: [
          {
            type: "text",
            content: capture[1],
          },
        ],
        target: capture[1],
      };
    },
  }),
  noem: {
    order: markdown.defaultRules.text.order,
    match: (source: string) => /^\\_/.exec(source),
    parse: () => {
      return {
        type: "text",
        content: "\\_",
      };
    },
  },
  em: Object.assign({}, markdown.defaultRules.em, {
    match: markdown.inlineRegex(/^\b_(\S(?:\\[\s\S]|[^\\])*?\S|\S)_(?!_)\b/),
    parse: (capture: markdown.Capture, parse: markdown.Parser) => {
      return {
        content: parse(capture[1]),
        type: "em",
      };
    },
  }),
  strong: Object.assign({}, markdown.defaultRules.strong, {
    match: markdown.inlineRegex(/^\*(\S(?:\\[\s\S]|[^\\])*?\S|\S)\*(?!\*)/),
  }),
  strike: Object.assign({}, markdown.defaultRules.del, {
    match: markdown.inlineRegex(/^~(\S(?:\\[\s\S]|[^\\])*?\S|\S)~(?!~)/),
  }),
  inlineCode: markdown.defaultRules.inlineCode,
  br: Object.assign({}, markdown.defaultRules.br, {
    match: markdown.anyScopeRegex(/^\n/),
  }),
  slackUser: {
    order: markdown.defaultRules.strong.order,
    match: (source: string) => /^<@([^|>]+)(\|([^>]*))?>/.exec(source),
    parse: (capture: markdown.Capture, parse: markdown.Parser, state: markdown.State) => {
      const name = capture[3] ? parse(capture[3], state) : "";
      return {
        id: capture[1],
        content: name,
      };
    },
  },
  slackChannel: {
    order: markdown.defaultRules.strong.order,
    match: (source: string) => /^<#([^|>]+)(\|([^>]*))?>/.exec(source),
    parse: (capture: markdown.Capture, parse: markdown.Parser, state: markdown.State) => {
      const name = capture[3] ? parse(capture[3], state) : "";
      return {
        id: capture[1],
        content: name,
      };
    },
  },
  slackUserGroup: {
    order: markdown.defaultRules.strong.order,
    match: (source: string) => /^<!subteam\^([^|>]+)(\|([^>]+))?>/.exec(source),
    parse: (capture: markdown.Capture, parse: markdown.Parser, state: markdown.State) => {
      const name = capture[3] ? parse(capture[3], state) : "";
      return {
        id: capture[1],
        content: name,
      };
    },
  },
  slackAtHere: {
    order: markdown.defaultRules.strong.order,
    match: (source: string) => /^<!here(\|([^>]*))?>/.exec(source),
    parse: (capture: markdown.Capture, parse: markdown.Parser, state: markdown.State) => {
      const name = capture[2] ? parse(capture[2], state) : "";
      return {
        content: name,
      };
    },
  },
  slackAtChannel: {
    order: markdown.defaultRules.strong.order,
    match: (source: string) => /^<!channel(\|([^>]*))?>/.exec(source),
    parse: (capture: markdown.Capture, parse: markdown.Parser, state: markdown.State) => {
      const name = capture[2] ? parse(capture[2], state) : "";
      return {
        content: name,
      };
    },
  },
  slackAtEveryone: {
    order: markdown.defaultRules.strong.order,
    match: (source: string) => /^<!everyone(\|([^>]*))?>/.exec(source),
    parse: (capture: markdown.Capture, parse: markdown.Parser, state: markdown.State) => {
      const name = capture[2] ? parse(capture[2], state) : "";
      return {
        content: name,
      };
    },
  },
  slackDate: {
    order: markdown.defaultRules.strong.order,
    match: (source: string) => /^<!date\^([^|>^]+)\^([^|>^]+)(\^([^|>^]+))?(\|([^>]*))?>/.exec(source),
    parse: (capture: markdown.Capture, parse: markdown.Parser, state: markdown.State) => {
      const name = capture[6] ? parse(capture[6], state) : "";
      const timestamp = capture[1];
      const format = capture[2];
      const link = capture[4];
      return {
        timestamp,
        format,
        link,
        content: name,
      };
    },
  },
};

function isTextNode(node: markdown.SingleASTNode | undefined) {
  if (!node) return false;
  return node.type === "text";
}

function mergeTextNodes(a: markdown.SingleASTNode, b: markdown.SingleASTNode): markdown.SingleASTNode {
  return {
    type: "text",
    content: a.content + b.content,
  };
}

export function cleanupAst(ast: markdown.SingleASTNode[]): markdown.SingleASTNode[] {
  const outAst: markdown.SingleASTNode[] = [];
  for (let i = 0; i < ast.length; i++) {
    let currentAstEl = ast[i];
    if (isArray(ast[i].content)) {
      currentAstEl.content = cleanupAst(currentAstEl.content);
    } else if (isTextNode(ast[i])) {
      // merge text nodes
      let mergedNode = ast[i];
      while (isTextNode(ast[i + 1])) {
        mergedNode = mergeTextNodes(mergedNode, ast[i + 1]);
        i++;
      }
      currentAstEl = mergedNode;
      if (!currentAstEl.content.length) {
        // empty text node
        continue;
      }
    }
    outAst.push(currentAstEl);
  }
  return outAst;
}

export function parseSlackMarkdown(text: string) {
  const cleanedText = text.replace(/&gt;/g, ">");
  const ast = markdown.parserFor(rules, { inline: true })(cleanedText);
  return cleanupAst(ast);
}

function textToString(nodes: string | markdown.SingleASTNode[]) {
  if (isString(nodes)) return nodes;
  let out = "";
  for (const n of nodes) {
    if (isString(n.content)) out += n.content;
  }
  return out;
}

function createLink(href: string, text: string) {
  return {
    text: text,
    type: "text",
    marks: [
      {
        type: "link",
        attrs: {
          href: href,
          target: "_blank",
        },
      },
    ],
  };
}

function createBoldText(text: string) {
  return {
    text,
    type: "text",
    marks: [
      {
        type: "bold",
      },
    ],
  };
}

const typeMap = new Map([
  ["inlineCode", "code"],
  ["strong", "bold"],
  ["em", "italic"],
  ["strike", "strike"],
]);

export type TransformContext = {
  slackTeamId?: string;
  mentionedUsersBySlackId?: {
    [slackId: string]: EditorMentionData;
  };
  mentionedNamesBySlackId?: {
    [slackId: string]: string;
  };
};

function transformNode(node: markdown.SingleASTNode, context: TransformContext = {}) {
  switch (node.type) {
    case "text":
      return { text: node.content, type: "text" };
    case "emoji":
      return {
        type: "emoji",
        attrs: {
          data: {
            name: node.content,
            emoji: emojiNameToEmoji[node.content],
          },
        },
      };
    case "autolink":
    case "url":
      return createLink(node.target, textToString(node.content));
    case "blockQuote":
      return {
        type: "blockquote",
        content: detectedAndTransformParagraphs(node.content, context),
      };
    case "codeBlock":
      // currently not supported so let's use blockquote
      return {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: node.content,
              },
            ],
          },
        ],
      };
    case "slackUser":
      if (context.mentionedUsersBySlackId && context.mentionedUsersBySlackId[node.id]) {
        return {
          type: MENTION_TYPE_KEY,
          attrs: {
            data: context.mentionedUsersBySlackId[node.id],
          },
        };
      }
      return createBoldText(`@${textToString(node.content) || context.mentionedNamesBySlackId?.[node.id] || node.id}`);
    case "slackChannel":
    case "slackUserGroup":
      return createLink(
        `https://app.slack.com/client/${context.slackTeamId}/${node.id}`,
        `#${textToString(node.content) || node.id}`
      );
    case "slackAtHere":
      return createBoldText("@here");
    case "slackAtChannel":
      return createBoldText("@channel");
    case "slackAtEveryone":
      return createBoldText("@everyone");
    case "slackDate":
      //todo: not sure if we need this
      return createBoldText(`@${node.name}`);
  }
  if (typeMap.has(node.type)) {
    return {
      text: textToString(node.content) || " ",
      type: "text",
      marks: [
        {
          type: typeMap.get(node.type),
        },
      ],
    };
  }
  return node;
}

function detectedAndTransformParagraphs(
  ast: markdown.SingleASTNode[],
  context: TransformContext = {}
): markdown.SingleASTNode[] {
  const paragraphs = [];
  let buffer = [];
  for (const node of ast) {
    if (node.type !== "br") {
      buffer.push(node);
      continue;
    }
    if (buffer.length !== 0) {
      paragraphs.push(buffer);
      buffer = [];
    }
  }
  if (buffer.length !== 0) {
    paragraphs.push(buffer);
  }
  return paragraphs
    .map((p) => ({
      type: "paragraph",
      content: compact(p.map((n) => transformNode(n, context))),
    }))
    .filter((p) => p.content.length > 0);
}

export function transformToTipTapJSON(ast: markdown.SingleASTNode[], context: TransformContext = {}) {
  return {
    type: "doc",
    content: detectedAndTransformParagraphs(ast, context),
  };
}

export function parseAndTransformToTipTapJSON(text: string, context: TransformContext = {}) {
  return transformToTipTapJSON(parseSlackMarkdown(text), context);
}
