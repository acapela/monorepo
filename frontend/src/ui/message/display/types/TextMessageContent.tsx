import styled from "styled-components";

import { MessageBasicInfoFragment } from "~gql";
import { richEditorContentCss } from "~richEditor/Theme";
import { convertRichEditorContentToHtml } from "~richEditor/content/html";
import { RichContentRenderer } from "~richEditor/content/RichContentRenderer";
interface Props {
  message: MessageBasicInfoFragment;
}

function renderMessageContent(message: MessageBasicInfoFragment) {
  try {
    const htmlContent = convertRichEditorContentToHtml(message.content);

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>;
  } catch (error) {
    console.log({ error, message });
    return <div>Failed to display message content</div>;
  }
}

export function MessageText({ message }: Props) {
  return (
    <UIHolder>
      <RichContentRenderer content={message.content} />
    </UIHolder>
  );
}

const UIHolder = styled.div`
  ${richEditorContentCss};
`;
