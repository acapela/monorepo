import { AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { Button } from "@aca/ui/buttons/Button";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconPlus } from "@aca/ui/icons";
import { PopoverPanel } from "@aca/ui/popovers/PopoverPanel";
import { theme } from "@aca/ui/theme";

import { FilterEditor } from "./FilterEditor";
import { FilterIntegrationPicker } from "./FilterIntegrationPicker";

type NewFilterState = boolean | NotificationFilter;

interface Props {
  onCreateRequest: (filter: NotificationFilter) => void;
}

export function NewFilterCreator({ onCreateRequest }: Props) {
  const [isCreatingNew, setIsCreatingNew] = useState<NewFilterState>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <UIHolder>
        {/* <IconButton
          ref={buttonRef}
          tooltip="Add new filter..."
          kind="primarySubtle"
          icon={<IconPlus />}
          onClick={() => {
            setIsCreatingNew(true);
          }}
        >
          Add filter
        </IconButton> */}
        <Button
          ref={buttonRef}
          tooltip="Add new filter..."
          kind="primarySubtle"
          icon={<IconPlus />}
          onClick={() => {
            setIsCreatingNew(true);
          }}
        >
          Add filter
        </Button>
      </UIHolder>
      <AnimatePresence>
        {isCreatingNew === true && (
          <CompactPopoverPanel
            enableScreenCover
            key={"pick-type"}
            placement="bottom-start"
            anchorRef={buttonRef}
            onCloseRequest={() => {
              setIsCreatingNew(false);
            }}
          >
            <FilterIntegrationPicker
              onPicked={(integration) => {
                setIsCreatingNew({ __typename: integration.notificationTypename });
              }}
            />
          </CompactPopoverPanel>
        )}
        {typeof isCreatingNew !== "boolean" && (
          <CustomizePopoverPanel
            enableScreenCover
            key={"customize"}
            placement="bottom-start"
            anchorRef={buttonRef}
            onCloseRequest={() => {
              setIsCreatingNew(false);
            }}
          >
            <FilterEditor
              filter={isCreatingNew}
              onChange={(filter) => {
                setIsCreatingNew(filter);
              }}
              onSubmit={(filter) => {
                setIsCreatingNew(false);
                onCreateRequest(filter);
              }}
            />
          </CustomizePopoverPanel>
        )}
      </AnimatePresence>
    </>
  );
}

const UIHolder = styled.div``;

const CompactPopoverPanel = styled(PopoverPanel)`
  ${theme.box.popover}
`;

const CustomizePopoverPanel = styled(PopoverPanel)`
  width: 400px;
`;
