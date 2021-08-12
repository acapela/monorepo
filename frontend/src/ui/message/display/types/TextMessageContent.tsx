import { gql } from "@apollo/client";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { messageComposerExtensions } from "~frontend/message/extensions";
import { MessageText_MessageFragment } from "~gql";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";
import { RichContentRenderer } from "~richEditor/content/RichContentRenderer";
import { richEditorContentCss } from "~richEditor/Theme";
import { ErrorBoundary } from "~ui/ErrorBoundary";

export const MessageText = withFragments(
  {
    message: gql`
      fragment MessageText_message on message {
        content
      }
    `,
  },
  styled<{
    message: MessageText_MessageFragment;
    className?: string;
  }>(({ message, className }) =>
    isRichEditorContentEmpty(message.content) ? null : (
      <UIHolder className={className}>
        <ErrorBoundary errorFallback={<div>Failed to render message content</div>}>
          <RichContentRenderer extensions={messageComposerExtensions} content={message.content} />
        </ErrorBoundary>
      </UIHolder>
    )
  )``
);

const UIHolder = styled.div<{}>`
  ${richEditorContentCss};
`;
