import styled from "styled-components";

import { MessageBasicInfoFragment } from "~gql";
import { richEditorContentCss } from "~richEditor/Theme";
import { RichContentRenderer } from "~richEditor/content/RichContentRenderer";
import { messageComposerExtensions } from "~frontend/message/extensions";
import { ErrorBoundary } from "~ui/ErrorBoundary";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";

interface Props {
  message: MessageBasicInfoFragment;
  className?: string;
}

export const MessageText = styled(({ message, className }: Props) => {
  if (isRichEditorContentEmpty(message.content)) return null;

  return (
    <UIHolder className={className}>
      <ErrorBoundary errorFallback={<div>Failed to render message content</div>}>
        <RichContentRenderer extensions={messageComposerExtensions} content={message.content} />
      </ErrorBoundary>
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  ${richEditorContentCss};
`;
