import { ReactNode, RefObject, useRef } from "react";
import styled, { css } from "styled-components";

import { PopPresenceAnimator } from "~ui/animations";
import { CloseIconButton } from "~ui/buttons/CloseIconButton";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Popover, PopoverPlacement } from "~ui/popovers/Popover";
import { theme } from "~ui/theme";

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

export const Modal = styled(function Modal({
  head,
  hasCloseButton = true,
  children,
  onCloseRequest,
  anchor,
  className,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useShortcut("Escape", onCloseRequest);

  const modalBodyNode = (
    <UIModal
      ref={modalRef}
      className={className}
      // Stop propagation so click is not reaching screen covering holder of modal. (holder clicks are closing the modal)
      onClick={(event) => event.stopPropagation()}
      role="dialog"
    >
      <UIToolbar isFlying={!head}>
        <UIHead>
          <UITitle>{head?.title}</UITitle>
          {hasCloseButton && <CloseIconButton kind="primarySubtle" onClick={onCloseRequest} />}
        </UIHead>
        {head?.description && <UIDescription>{head.description}</UIDescription>}
      </UIToolbar>
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
})``;

const background = theme.colors.layout.background;

const UIModal = styled(PopPresenceAnimator)<{}>`
  min-width: 368px;
  width: 420px;
  max-width: 100vw;
  ${theme.common.flexDiv}

  ${background.asBg};

  border: 1px solid ${background.border.value};

  ${theme.shadow.modal};
  ${theme.radius.panel};
`;

const UIHead = styled.div<{}>`
  flex: 1;
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap}
`;

const UIBody = styled.div<{}>`
  align-items: center;
  padding: 24px;
  min-height: 0;
  ${theme.common.flexDiv}
`;

const UIToolbar = styled.div<{ isFlying: boolean }>`
  display: flex;
  flex-direction: column;
  ${theme.spacing.actions.asGap}
  padding: 24px 24px 0;

  ${CloseIconButton} {
    align-self: flex-end;
    position: relative;
  }

  ${(props) => props.isFlying && css`position: absolute; top; 0; left: 0; right: 0;`}
`;

const UITitle = styled.h3`
  ${theme.typo.secondaryTitle};
  flex-grow: 1;
  min-width: 0;
`;

const UIDescription = styled.h3`
  ${theme.typo.content.secondary};
`;
