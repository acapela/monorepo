import { gql } from "@apollo/client";
import { ErrorBoundary } from "@sentry/nextjs";
import { JSONContent } from "@tiptap/core";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { messageComposerExtensions } from "~frontend/message/extensions";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";
import { RichContentRenderer } from "~richEditor/content/RichContentRenderer";
import { richEditorContentCss } from "~richEditor/Theme";

const fragments = {
  message: gql`
    fragment MessageText_message on message {
      content
    }
  `,
};

type Props = {
  content: JSONContent;
  className?: string;
};

export const MessageText = withFragments(
  fragments,
  styled<Props>(({ content, className }) =>
    isRichEditorContentEmpty(content) ? null : (
      <UIHolder className={className}>
        <ErrorBoundary fallback={<div>Failed to render message content</div>}>
          <RichContentRenderer extensions={messageComposerExtensions} content={content} />
        </ErrorBoundary>
      </UIHolder>
    )
  )``
);

const UIHolder = styled.div<{}>`
  ${richEditorContentCss};
`;
