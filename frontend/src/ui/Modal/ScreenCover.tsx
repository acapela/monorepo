import { ReactNode, RefObject } from "react";
import styled from "styled-components";
import { handleWithStopPropagation } from "~shared/events";
import { BodyPortal } from "~ui/BodyPortal";
import { PopoverPlacement } from "~ui/popovers/Popover";

export interface ModalAnchor {
  ref: RefObject<HTMLElement>;
  placement?: PopoverPlacement;
}
interface Props {
  children: ReactNode;
  onCloseRequest?: () => void;
}

export function ScreenCover({ children, onCloseRequest }: Props) {
  return (
    <BodyPortal>
      <UIBodyCover onClick={handleWithStopPropagation(onCloseRequest)}>{children}</UIBodyCover>
    </BodyPortal>
  );
}

const BLUR = "4px";

const UIBodyCover = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(240, 240, 240, 0.38);
  --blur: 10px;
  @supports (backdrop-filter: blur(${BLUR})) or (--webkit-backdrop-filter: blur(${BLUR})) {
    backdrop-filter: blur(${BLUR});
    --webkit-backdrop-filter: blur(${BLUR});
  }
`;
