import { ReactNode, RefObject, useRef } from "react";
import styled from "styled-components";
import { PopPresenceAnimator } from "~ui/animations";
import { borderRadius, shadow } from "~ui/baseStyles";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { IconCross } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Popover, PopoverPlacement } from "~ui/popovers/Popover";
import { TextBody, TextH3 } from "~ui/typo";
import { ScreenCover } from "./ScreenCover";

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
  className?: string;
  onCloseRequest: () => void;
  // Modal can be attached to some element instead of center of the screen.
  anchor?: ModalAnchor;
}

export function Modal({ head, hasCloseButton = true, children, onCloseRequest, anchor, className }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useShortcut("Escape", onCloseRequest);

  const modalBodyNode = (
    <UIModal
      ref={modalRef}
      className={className}
      // Stop propagation so click is not reaching screen covering holder of modal. (holder clicks are closing the modal)
      onClick={(event) => event.stopPropagation()}
    >
      {hasCloseButton && (
        <UIToolbar>
          <UIHead>
            {head && (
              <>
                <TextH3 speziaExtended semibold>
                  {head.title}
                </TextH3>
                <TextBody secondary>{head.description}</TextBody>
              </>
            )}
          </UIHead>
          <CircleIconButton icon={<IconCross />} onClick={onCloseRequest} />
        </UIToolbar>
      )}
      <UIBody>{children}</UIBody>
    </UIModal>
  );

  return (
    <ScreenCover isTransparent={false} onCloseRequest={onCloseRequest}>
      {/* Modal is attached to some element instead of center of the screen. */}
      {anchor && (
        <Popover anchorRef={anchor.ref} placement={anchor.placement}>
          {modalBodyNode}
        </Popover>
      )}

      {!anchor && modalBodyNode}
    </ScreenCover>
  );
}

const UIModal = styled(PopPresenceAnimator)`
  min-width: 368px;

  background: #ffffff;

  border: 1px solid #f8f8f8;

  ${shadow.modal};
  ${borderRadius.modal};
`;

const UIHead = styled.div`
  flex: 1;
`;

const UIBody = styled.div`
  align-items: center;
  padding: 24px;
`;

const UIToolbar = styled.div`
  display: flex;
  padding: 24px 24px 0;
  margin-bottom: 32px;

  ${CircleIconButton} {
    margin-top: -4px;
  }
`;
