import React from "react";
import styled, { keyframes } from "styled-components";

import { IconLoader } from "~ui/icons";
import { theme } from "~ui/theme";

export const UploadingAttachmentPreview = () => {
  return (
    <UIHolder>
      <UIHolderWr>
        <IconLoader />
      </UIHolderWr>
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.colors.layout.softLine()};
  ${theme.borderRadius.item}
`;

const spinAnimation = keyframes`
    0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const UIHolderWr = styled.div`
  font-size: 2rem;
  animation: ${spinAnimation} 2s linear infinite;
`;
