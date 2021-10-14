import React from "react";
import styled from "styled-components";

import { CurvedArrow } from "~ui/arrows/CurvedArrow";

interface Props {
  className?: string;
}

export const CreateRequestPrompt = styled(function CreateTopicPrompt({ className }: Props) {
  return (
    <UIHolder className={className}>
      <UICreateATopicLabel>Create a Request</UICreateATopicLabel>
      <UICurvedArrowHolder>
        <CurvedArrow />
      </UICurvedArrowHolder>
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

/* ${theme.font.permanentMarker.build()} */
const UICreateATopicLabel = styled.div<{}>`
  /* TODO PR */

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
