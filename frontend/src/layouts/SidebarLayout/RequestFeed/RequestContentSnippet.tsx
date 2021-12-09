import { JSONContent } from "@tiptap/react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicEntity } from "~frontend/clientdb/topic";
import { MessageText } from "~frontend/message/display/types/TextMessageContent";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";
import { styledObserver } from "~shared/component";
import { getIsMentionNode } from "~shared/editor/mentions";
import { theme } from "~ui/theme";

interface Props {
  topic: TopicEntity;
  className?: string;
}

function getContentParagraphWithMatchingNode(
  content: JSONContent,
  filter: (node: JSONContent) => boolean
): JSONContent | null {
  if (content.type !== "paragraph") {
    if (content.content) {
      for (const child of content.content) {
        const paragraphInChild = getContentParagraphWithMatchingNode(child, filter);

        if (paragraphInChild) return paragraphInChild;
      }
    }

    return null;
  }

  // Content is paragraph

  if (!content.content) {
    return null;
  }

  for (const child of content.content) {
    const isChildNodeMatching = filter(child);

    if (isChildNodeMatching) {
      return content;
    }
  }

  return null;
}

function getFirstContentParagraph(content: JSONContent): JSONContent | null {
  if (content.type === "paragraph" && !isRichEditorContentEmpty(content)) {
    return content;
  }

  if (!content.content) return null;

  for (const child of content.content) {
    if (child.type === "paragraph" && !isRichEditorContentEmpty(child)) {
      return child;
    }

    const paragraphInChild = getFirstContentParagraph(child);

    if (paragraphInChild) return paragraphInChild;
  }

  return null;
}

function getContentSnippetForUser(content: JSONContent, userId: string) {
  const paragraphMentioningUser = getContentParagraphWithMatchingNode(content, (node) => {
    if (!getIsMentionNode(node)) return false;

    return node.attrs.data.userId === userId;
  });

  if (paragraphMentioningUser) {
    return paragraphMentioningUser;
  }

  return getFirstContentParagraph(content);
}

export const RequestContentSnippet = styledObserver(({ topic, className }: Props) => {
  const user = useAssertCurrentUser();
  const lastMessage = topic.messages.last;

  if (!lastMessage) {
    return null;
  }

  const contentSnippet = getContentSnippetForUser(lastMessage.content, user.id);

  if (!contentSnippet) {
    return null;
  }

  return (
    <UIHolder data-no-tooltips className={className}>
      <MessageText content={contentSnippet} />
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  ${theme.typo.label};
  pointer-events: none;
`;
