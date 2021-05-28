import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import styled, { css } from "styled-components";
import { DANGER_COLOR } from "~ui/colors";
import { IconMenu } from "~ui/icons";
import { Tooltip } from "~ui/popovers/Tooltip";
import { SecondaryText } from "~ui/typo";

interface Props {
  isActive: boolean;
  onActiveChange(isActive: boolean): void;
  onRemoveRequest: () => void;
  onEditRequest: () => void;
}

export const MessageActions = ({ isActive, onActiveChange, onEditRequest, onRemoveRequest }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);

  type Mode = "idle" | "menu" | "confirm-remove";

  function getMode(): Mode {
    if (isConfirmingRemove) return "confirm-remove";

    if (isActive) return "menu";

    return "idle";
  }

  const mode = getMode();
  const hasPopup = mode !== "idle";

  return (
    <>
      <Tooltip anchorRef={ref} label="Show Options" isDisabled={hasPopup} />
      <UIHolder ref={ref}>
        <MoreIcon onClick={onActiveChange.bind(null, true)} />
        <UIPopupFlyer>
          <AnimatePresence>
            {hasPopup && (
              <UIPopupBody
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <UIPopupContent layout="position">
                  {mode === "menu" && (
                    <>
                      <UILabel onClick={onEditRequest}>Edit message</UILabel>
                      <UILabel onClick={() => setIsConfirmingRemove(true)}>Remove message</UILabel>
                    </>
                  )}
                  {mode === "confirm-remove" && (
                    <>
                      <UILabel onClick={onRemoveRequest} isDanger>
                        Confirm remove
                      </UILabel>
                    </>
                  )}
                </UIPopupContent>
              </UIPopupBody>
            )}
          </AnimatePresence>
        </UIPopupFlyer>
      </UIHolder>
    </>
  );
};

const UIHolder = styled.div`
  position: relative;
`;
const MoreIcon = styled(IconMenu)`
  font-size: 24px;
  border-radius: 0.3em;
  padding: 0.1em;

  &:hover {
    background-color: #eee;
  }
`;

const UIPopupFlyer = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-bottom: 10px;
`;

const UIPopupBody = styled(motion.div)`
  opacity: 1;
  background: #000;
  color: #fff;
  box-shadow: 0 0 10px #00000038;
  padding: 1rem;
  border-radius: 11px;
  overflow: hidden;
`;

const UIPopupContent = styled(motion.div)``;

const UILabel = styled(SecondaryText)<{ isDanger?: boolean }>`
  white-space: nowrap;
  display: block;
  cursor: pointer;

  ${(props) => {
    if (props.isDanger) {
      return css`
        color: ${DANGER_COLOR};
      `;
    }
  }}

  & + & {
    margin-top: 1rem;
  }
`;
