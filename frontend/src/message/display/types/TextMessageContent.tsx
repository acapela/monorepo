import { ErrorBoundary } from "@sentry/react";
import { JSONContent } from "@tiptap/core";
import styled from "styled-components";

import { messageComposerExtensions } from "~frontend/message/extensions";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";
import { RichContentRenderer } from "~richEditor/content/RichContentRenderer";
import { richEditorContentCss } from "~richEditor/Theme";

type Props = {
  content: JSONContent;
  className?: string;
};

export const MessageText = styled<Props>(({ content, className }) =>
  isRichEditorContentEmpty(content) ? null : (
    <UIHolder className={className}>
      <ErrorBoundary fallback={<div>Failed to render message content</div>}>
        <RichContentRenderer extensions={messageComposerExtensions} content={content} />
      </ErrorBoundary>
    </UIHolder>
  )
)``;

const UIHolder = styled.div<{}>`
  ${richEditorContentCss};
`;
