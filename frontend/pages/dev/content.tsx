import { JSONContent } from "@tiptap/react";
import { noop } from "lodash";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { MessageContentEditor } from "~frontend/message/composer/MessageContentComposer";
import { getEmptyRichContent } from "~richEditor/RichEditor";
import { useBase64SearchParam } from "~shared/hooks/useMutableSearchParam";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";

function stringifyJSONWithIndent(input: unknown) {
  return JSON.stringify(input, undefined, 2);
}

export default function DevContentPage() {
  const [content, setContent] = useBase64SearchParam<JSONContent>("content", getEmptyRichContent);
  const [dirtyContent, setDirtyContent] = useState(stringifyJSONWithIndent(content));

  useEffect(() => {
    setDirtyContent(stringifyJSONWithIndent(content));
  }, [content]);
  return (
    <UIHolder>
      <UILabel>Edit content here</UILabel>
      <UIEditor>
        <MessageContentEditor
          content={content}
          onContentChange={setContent}
          attachmentDrafts={[]}
          onAttachmentRemoveRequest={noop}
          onFilesSelected={noop}
        />
      </UIEditor>

      <UILabel>Edit or copy JSON here here</UILabel>
      <UIEditor>
        <UIContentJSON
          value={dirtyContent}
          onChange={(event) => {
            setDirtyContent(event.target.value);
          }}
        />
      </UIEditor>

      <Button
        kind="primary"
        shortcut={["Mod", "Enter"]}
        onClick={() => {
          try {
            setContent(JSON.parse(dirtyContent));
          } catch (error) {
            alert("Failed to parse content. Maybe JSON is malformed");
          }
        }}
      >
        Update editor with JSON
      </Button>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  max-width: 1240px;
  margin: auto;
  display: flex;
  flex-direction: column;
  ${theme.spacing.pageSections.asGap}
`;

const UILabel = styled.div`
  ${theme.typo.pageTitle};
`;

const UIEditor = styled.div`
  ${theme.colors.layout.backgroundAccent.asBg}
`;

const UIContentJSON = styled.textarea`
  min-height: 500px;
  width: 100%;
  background: transparent;
  ${theme.font.speziaMono.semibold};
  font-size: 11px;
  outline: none;
`;
