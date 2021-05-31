import { RefObject } from "react";
import styled from "styled-components";
import { Button, TransparentButton } from "~ui/button";
import { Popover } from "~ui/popovers/Popover";
import { TextTitle } from "~ui/typo";
import { useCloseTopicMutation } from "~frontend/gql/topics";

interface Props {
  topicId: string;
  onDismissRequested: () => void;
  onTopicClosed: () => void;
  anchorRef: RefObject<HTMLElement>;
}

export const CloseTopicPopover = ({ anchorRef, topicId, onDismissRequested, onTopicClosed }: Props) => {
  const [closeTopicMutation, { loading }] = useCloseTopicMutation();

  async function handleCloseTopic() {
    await closeTopicMutation({
      topicId,
      closedAt: new Date().toISOString(),
    });

    onTopicClosed();
  }

  return (
    <Popover anchorRef={anchorRef} placement={"bottom-end"} distance={8}>
      <UIPopover>
        <UIBody>
          <UITitle>Almost done!</UITitle>
          <UIBodyText>You can reopen this topic if you change your mind.</UIBodyText>
          <UIButtons>
            <Button isLoading={loading} onClick={handleCloseTopic}>
              Close
            </Button>
            <TransparentButton isLoading={loading} onClick={onDismissRequested}>
              Cancel
            </TransparentButton>
          </UIButtons>
        </UIBody>
      </UIPopover>
    </Popover>
  );
};

const UIPopover = styled.div`
  width: 300px;

  background: hsl(0, 0%, 100%);

  border: 1px solid hsl(214.3, 13%, 89%);

  box-shadow: 0px 20px 13px rgba(0, 0, 0, 0.035), 0px 8.14815px 6.51852px rgba(0, 0, 0, 0.0274815),
    0px 1.85185px 3.14815px rgba(0, 0, 0, 0.0168519);
  border-radius: 1rem;
`;

const UITitle = styled(TextTitle)`
  padding-bottom: 8px;
`;

const UIBodyText = styled.div`
  font-weight: 400;
  line-height: 1.5;
  font-size: 0.75rem;
`;

const UIBody = styled.div`
  align-items: center;
  padding: 32px;
  text-align: center;
`;

const UIButtons = styled.div`
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${Button} {
    margin-top: 8px;
  }
`;
