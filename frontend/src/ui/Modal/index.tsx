import { ReactNode, RefObject, useRef } from "react";
import styled from "styled-components";

import { theme } from "~frontend/../../ui/theme";
import { PopPresenceAnimator } from "~ui/animations";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Popover, PopoverPlacement } from "~ui/popovers/Popover";

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
                <UITitle>{head.title}</UITitle>
                <UIDescription>{head.description}</UIDescription>
              </>
            )}
          </UIHead>
          <CircleCloseIconButton onClick={onCloseRequest} />
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

const background = theme.colors.layout.background;

const UIModal = styled(PopPresenceAnimator)<{}>`
  min-width: 368px;

  ${background.asBg};

  border: 1px solid ${background.border.value};

  ${theme.shadow.modal};
  ${theme.radius.panel};
`;

const UIHead = styled.div<{}>`
  flex: 1;
`;

const UIBody = styled.div<{}>`
  align-items: center;
  padding: 24px;
`;

const UIToolbar = styled.div<{}>`
  display: flex;
  padding: 24px 24px 0;
  margin-bottom: 32px;

  ${CircleCloseIconButton} {
    margin-top: -4px;
  }
`;

const UITitle = styled.h3`
  ${theme.typo.pageTitle};
`;

const UIDescription = styled.h3`
  ${theme.typo.content.secondary};
`;
