import { ReactNode, RefObject, useRef } from "react";
import styled from "styled-components";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { BodyPortal } from "~ui/BodyPortal";
import { IconCross } from "~ui/icons";
import { SecondaryText } from "~ui/typo";
import { IconButton } from "~ui/buttons/IconButton";
import { Popover, PopoverPlacement } from "~ui/popovers/Popover";
import { useClickAway } from "react-use";
import { useShortcut } from "~ui/keyboard/useShortcut";

export interface ModalAnchor {
  ref: RefObject<HTMLElement>;
  placement?: PopoverPlacement;
}
interface Props {
  head?: {
    title: ReactNode;
    description?: ReactNode;
  };
  hasCloseButton?: boolean;
  children: ReactNode;
  onCloseRequest: () => void;
  // Modal can be attached to some element instead of center of the screen.
  anchor?: ModalAnchor;
}

export function Modal({ head, hasCloseButton = true, children, onCloseRequest, anchor }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickAway(modalRef, onCloseRequest);
  useShortcut("Escape", onCloseRequest);

  const modalBodyNode = (
    <UIModal
      ref={modalRef}
      onClick={(event) => {
        event.stopPropagation();
      }}
      presenceStyles={{ opacity: [0, 1], scale: [0.95, 1] }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
    >
      {hasCloseButton && (
        <UIToolbar>
          <IconButton icon={<IconCross />} onClick={onCloseRequest} />
        </UIToolbar>
      )}
      <UIBody>
        {head && (
          <UIHead>
            <UIHeadTitle>{head.title}</UIHeadTitle>
            <SecondaryText>{head.description}</SecondaryText>
          </UIHead>
        )}
        {children}
      </UIBody>
    </UIModal>
  );

  // Modal is attached to some element instead of center of the screen.
  if (!anchor) {
    return (
      <BodyPortal>
        <UIBodyCover
          onClick={(event) => {
            event.stopPropagation();
            onCloseRequest();
          }}
        >
          {modalBodyNode}
        </UIBodyCover>
      </BodyPortal>
    );
  }

  return (
    <Popover anchorRef={anchor.ref} placement={anchor.placement}>
      {modalBodyNode}
    </Popover>
  );
}

const UIBodyCover = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UIModal = styled(PresenceAnimator)`
  min-width: 368px;

  background: #ffffff;

  border: 1px solid #f8f8f8;

  box-shadow: 0px 100px 80px rgba(0, 0, 0, 0.07), 0px 64.8148px 46.8519px rgba(0, 0, 0, 0.0531481),
    0px 38.5185px 25.4815px rgba(0, 0, 0, 0.0425185), 0px 20px 13px rgba(0, 0, 0, 0.035),
    0px 8.14815px 6.51852px rgba(0, 0, 0, 0.0274815), 0px 1.85185px 3.14815px rgba(0, 0, 0, 0.0168519);
  border-radius: 1rem;
`;

const UIHead = styled.div`
  line-height: 1.5;
  text-align: center;
  margin-bottom: 2rem;
`;

const UIBody = styled.div`
  align-items: center;
  padding: 1.5rem;
`;

const UIHeadTitle = styled.div``;

const UIToolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1rem 0;
`;
