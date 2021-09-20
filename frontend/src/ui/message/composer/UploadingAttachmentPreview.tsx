import React from "react";
import styled, { keyframes } from "styled-components";

import { IconLoader } from "~ui/icons";
import { theme } from "~ui/theme";

interface Props {
  percentage: number;
}

export const UploadingAttachmentPreview = ({ percentage }: Props) => {
  return (
    <UIHolder>
      <UIContentHolder>
        <UIIconHolder>
          <IconLoader />
        </UIIconHolder>
        <UIPercentageHolder>{percentage}%</UIPercentageHolder>
      </UIContentHolder>
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

const UIContentHolder = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const UIIconHolder = styled.div`
  font-size: 2rem;
  animation: ${spinAnimation} 2s linear infinite;
`;

const UIPercentageHolder = styled.div`
  position: absolute;
  bottom: -20px;
  ${theme.font.body12.build};
  color: ${theme.colors.layout.supportingText()};
`;
