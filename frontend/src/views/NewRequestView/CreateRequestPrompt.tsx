import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { CurvedArrow } from "~ui/icons/CurvedArrow";
import { theme } from "~ui/theme";

interface Props extends HTMLMotionProps<"div"> {
  className?: string;
}

export const CreateRequestPrompt = styled(function CreateTopicPrompt(props: Props) {
  return (
    <UIHolder {...props}>
      <UICreateATopicLabel>Make a Request</UICreateATopicLabel>
      <UICurvedArrowHolder>
        <CurvedArrow />
      </UICurvedArrowHolder>
    </UIHolder>
  );
})``;

const UIHolder = styled(motion.div)<{}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none !important;
`;

const UICreateATopicLabel = styled.div<{}>`
  ${theme.font.permanentMarker}

  padding-right: 46px;

  /* <Framer css> */
  transform: rotate(-9deg);
  color: #ff57e3;
  font-size: 18px;
  /* </Framer css> */
`;

const UICurvedArrowHolder = styled.div<{}>`
  width: 50px;
  height: 58px;
  overflow: visible;
  transform: rotate(15deg);
`;
