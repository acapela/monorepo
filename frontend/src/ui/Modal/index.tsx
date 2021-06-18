import { ReactNode, RefObject, useRef } from "react";
import styled from "styled-components";
import { POP_PRESENCE_STYLES } from "~ui/animations";
import { borderRadius, shadow } from "~ui/baseStyles";
import { IconButton } from "~ui/buttons/IconButton";
import { IconCross } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Popover, PopoverPlacement } from "~ui/popovers/Popover";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { SecondaryText } from "~ui/typo";
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
      presenceStyles={POP_PRESENCE_STYLES}
      // Stop propagation so click is not reaching screen covering holder of modal. (holder clicks are closing the modal)
      onClick={(event) => event.stopPropagation()}
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

  return (
    <ScreenCover enableBlur onCloseRequest={onCloseRequest}>
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

const UIModal = styled(PresenceAnimator)`
  min-width: 368px;

  background: #ffffff;

  border: 1px solid #f8f8f8;

  ${shadow.modal};
  ${borderRadius.modal};
`;

const UIHead = styled.div`
  line-height: 1.5;
  text-align: center;
  margin-bottom: 32px;
`;

const UIBody = styled.div`
  align-items: center;
  padding: 24px;
`;

const UIHeadTitle = styled.div``;

const UIToolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 16px 0;
`;
