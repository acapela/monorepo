import { ErrorBoundary } from "@sentry/react";
import { JSONContent } from "@tiptap/core";
import styled from "styled-components";

import { PageLayoutAnimator } from "@aca/frontend/animations/layout";
import { messageComposerExtensions } from "@aca/frontend/message/extensions";
import { isRichEditorContentEmpty } from "@aca/richEditor/content/isEmpty";
import { RichContentRenderer } from "@aca/richEditor/content/RichContentRenderer";
import { richEditorContentCss } from "@aca/richEditor/Theme";

type Props = {
  content: JSONContent;
  className?: string;
  animationLayoutId?: string;
};

export const MessageText = styled<Props>(({ content, className, animationLayoutId }) =>
  isRichEditorContentEmpty(content) ? null : (
    <UIHolder className={className} layoutId={animationLayoutId}>
      <ErrorBoundary fallback={<div>Failed to render message content</div>}>
        <RichContentRenderer extensions={messageComposerExtensions} content={content} />
      </ErrorBoundary>
    </UIHolder>
  )
)``;

const UIHolder = styled(PageLayoutAnimator)<{}>`
  ${richEditorContentCss};
`;
