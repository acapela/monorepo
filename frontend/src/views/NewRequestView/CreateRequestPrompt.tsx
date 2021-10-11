import styled from "styled-components";

interface Props {
  className?: string;
}

export const CreateRequestPrompt = styled(function CreateTopicPrompt({ className }: Props) {
  return (
    <UIHolder className={className}>
      <UICreateATopicLabel>Create a Request</UICreateATopicLabel>
      <Arrow />
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const UICreateATopicLabel = styled.div<{}>`
  /* <Framer css> */
  padding-right: 46px;
  overflow: visible;
  transform: rotate(-9deg);
  font-family: "Permanent Marker";
  color: #ff57e3;
  font-size: 18px;
  letter-spacing: 0px;
  line-height: 1.2;
  /* </Framer css> */
`;

function Arrow() {
  return (
    <UIArrowStyles>
      <svg xmlns="http://www.w3.org/2000/svg" width="52" height="58">
        <path
          d="M 1.539 15.117 C 1.539 15.117 5.726 27.717 18 38 C 30.274 48.283 45.605 46.273 45.605 46.273"
          fill="transparent"
          stroke-width="3"
          stroke="rgb(255, 87, 227)"
          stroke-linecap="square"
        ></path>
        <path
          d="M 39 54 L 47 46 L 39 38"
          fill="transparent"
          stroke-width="3"
          stroke="rgb(255, 87, 227)"
          stroke-linecap="square"
        ></path>
      </svg>
    </UIArrowStyles>
  );
}

const UIArrowStyles = styled.div<{}>`
  width: 50px;
  height: 58px;
  overflow: visible;
  transform: rotate(15deg);
`;
