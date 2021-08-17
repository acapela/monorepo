import styled from "styled-components";

import { messageComposerExtensions } from "~frontend/message/extensions";
import { MessageBasicInfoFragment } from "~gql";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";
import { RichContentRenderer } from "~richEditor/content/RichContentRenderer";
import { richEditorContentCss } from "~richEditor/Theme";
import { ErrorBoundary } from "~ui/ErrorBoundary";

interface Props {
  message: MessageBasicInfoFragment;
  className?: string;
}

export const MessageText = styled<Props>(({ message, className }) => {
  if (isRichEditorContentEmpty(message.content)) return null;

  return (
    <UIHolder className={className}>
      <ErrorBoundary errorFallback={<div>Failed to render message content</div>}>
        <RichContentRenderer extensions={messageComposerExtensions} content={message.content} />
      </ErrorBoundary>
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  ${richEditorContentCss};
`;
