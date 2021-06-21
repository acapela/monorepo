import styled from "styled-components";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { TopicMessageBasicInfoFragment, TopicMessageDetailedInfoFragment } from "~gql";
import { richEditorContentCss } from "~richEditor/Theme";

interface Props {
  message: TopicMessageDetailedInfoFragment;
}

function renderMessageContent(message: TopicMessageBasicInfoFragment) {
  try {
    const converter = new QuillDeltaToHtmlConverter(message.content, {});

    const htmlContent = converter.convert();

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
