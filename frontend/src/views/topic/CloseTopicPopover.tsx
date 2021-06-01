import { RefObject, useRef } from "react";
import styled from "styled-components";
import { Button, TransparentButton } from "~ui/button";
import { Popover } from "~ui/popovers/Popover";
import { TextTitle } from "~ui/typo";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { useClickAway } from "react-use";

interface Props {
  topicId: string;
  loading: boolean;
  onDismissRequested: () => void;
  onTopicClosed: () => void;
  anchorRef: RefObject<HTMLElement>;
}

export const CloseTopicPopover = ({ anchorRef, onDismissRequested, onTopicClosed, loading }: Props) => {
  const holderRef = useRef<HTMLDivElement>(null);

  useClickAway(holderRef, () => {
    onDismissRequested();
  });

  async function handleCloseTopic() {
    onTopicClosed();
    onDismissRequested();
  }

  return (
    <Popover anchorRef={anchorRef} placement={"bottom-end"} distance={8}>
      <UIPopover ref={holderRef} presenceStyles={{ opacity: [0, 1], y: [0, 5] }} transition={{ delay: 0.15 }}>
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

const UIPopover = styled(PresenceAnimator)`
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
