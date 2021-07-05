import styled from "styled-components";

import { MessageBasicInfoFragment } from "~gql";
import { richEditorContentCss } from "~richEditor/Theme";
import { RichContentRenderer } from "~richEditor/content/RichContentRenderer";
import { messageComposerExtensions } from "~frontend/message/extensions";
interface Props {
  message: MessageBasicInfoFragment;
}

export function MessageText({ message }: Props) {
  return (
    <UIHolder>
      <RichContentRenderer extensions={messageComposerExtensions} content={message.content} />
    </UIHolder>
  );
}

const UIHolder = styled.div`
  ${richEditorContentCss};
`;
