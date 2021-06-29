import styled from "styled-components";

import { MessageBasicInfoFragment } from "~gql";
import { richEditorContentCss } from "~richEditor/Theme";
import { convertRichEditorContentToHtml } from "~richEditor/content/html";

interface Props {
  message: MessageBasicInfoFragment;
}

function renderMessageContent(message: MessageBasicInfoFragment) {
  try {
    const htmlContent = convertRichEditorContentToHtml(message.content);

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>;
  } catch (error) {
    return <div>Failed to display message content</div>;
  }
}

export function MessageText({ message }: Props) {
  return <UIHolder>{renderMessageContent(message)}</UIHolder>;
}

const UIHolder = styled.div`
  ${richEditorContentCss};
`;
