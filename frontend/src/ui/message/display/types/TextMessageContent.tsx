import styled from "styled-components";

import { MessageBasicInfoFragment } from "~gql";
import { richEditorContentCss } from "~richEditor/Theme";
import { RichContentRenderer } from "~richEditor/content/RichContentRenderer";
import { messageComposerExtensions } from "~frontend/message/extensions";
import { ErrorBoundary } from "~ui/ErrorBoundary";

interface Props {
  message: MessageBasicInfoFragment;
}

export function MessageText({ message }: Props) {
  return (
    <UIHolder>
      <ErrorBoundary errorFallback={<div>Failed to render message content</div>}>
        <RichContentRenderer extensions={messageComposerExtensions} content={message.content} />
      </ErrorBoundary>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  ${richEditorContentCss};
`;
