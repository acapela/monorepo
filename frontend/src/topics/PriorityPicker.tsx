import { AnimatePresence } from "framer-motion";
import React, { useRef } from "react";
import styled from "styled-components";

import { useBoolean } from "~shared/hooks/useBoolean";
import { upperCaseFirst } from "~shared/text/casing";
import { Button } from "~ui/buttons/Button";
import { ItemsDropdown } from "~ui/forms/OptionsDropdown/ItemsDropdown";
import { Popover } from "~ui/popovers/Popover";

import { Priority, PriorityIcon } from "./priority";

export function PriorityPicker({
  priority,
  onChange,
  children,
}: {
  priority: Priority;
  onChange: (priority: Priority) => void;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMenuOpen, { set: openMenu, unset: closeMenu }] = useBoolean(false);
  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <Popover enableScreenCover onClickOutside={closeMenu} anchorRef={ref} placement="bottom">
            <UIHolder>
              <ItemsDropdown
                items={[null, ...["critical", "high", "medium", "low"]] as Priority[]}
                dividerIndexes={[1]}
                iconGetter={(value) => <PriorityIcon priority={value} $invert />}
                labelGetter={(value) => (value ? upperCaseFirst(value) : "No priority")}
                keyGetter={(value) => value as never}
                selectedItems={[priority]}
                onItemSelected={(value) => {
                  closeMenu();
                  onChange(value);
                }}
              />
            </UIHolder>
          </Popover>
        )}
      </AnimatePresence>
      <UITriggerHolder ref={ref} onClick={openMenu}>
        {children ?? (
          <Button kind="secondary" icon={<PriorityIcon priority={priority} />} iconAtStart>
            {priority ? priority[0].toUpperCase() + priority.slice(1) : "Set priority"}
          </Button>
        )}
      </UITriggerHolder>
    </>
  );
}

const UITriggerHolder = styled.div<{}>`
  display: inline-block;
`;

const UIHolder = styled.div`
  min-width: 240px;
`;
