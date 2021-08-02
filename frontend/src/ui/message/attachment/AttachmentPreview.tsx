import React from "react";
import styled from "styled-components";
import { useAttachmentQuery, useDownloadUrlQuery } from "~frontend/gql/attachments";
import { WideIconButton } from "~ui/buttons/WideIconButton";
import { IconTrash } from "~ui/icons";
import { MessageAttachmentDisplayer } from "./MessageAttachmentDisplayer";

interface Props {
  id: string;
  onRemoveRequest?: (id: string) => void;
}

export const AttachmentPreview = ({ id, onRemoveRequest }: Props) => {
  const [attachment] = useAttachmentQuery({ id });
  const [attachmentInfo] = useDownloadUrlQuery({ id });

  if (!attachment) return null;

  return (
    <UIHolder>
      {!!attachmentInfo && !!onRemoveRequest && (
        <UIRemoveButtonHolder>
          <WideIconButton
            tooltip="Remove attachment"
            kind="primary"
            icon={<IconTrash />}
            onClick={() => onRemoveRequest(id)}
          />
        </UIRemoveButtonHolder>
      )}

      {attachmentInfo && (
        <MessageAttachmentDisplayer attachmentUrl={attachmentInfo.downloadUrl} attachment={attachment} />
      )}
    </UIHolder>
  );
};

const UIHolder = styled.div<{}>`
  display: flex;
  position: relative;
`;

const UIRemoveButtonHolder = styled.div<{}>`
  position: absolute;
  top: 8px;
  right: 8px;
`;
