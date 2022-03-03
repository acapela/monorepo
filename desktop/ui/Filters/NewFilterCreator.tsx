import { AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { getUUID } from "@aca/shared/uuid";
import { Button } from "@aca/ui/buttons/Button";
import { IconPlus } from "@aca/ui/icons";
import { PopoverPanel } from "@aca/ui/popovers/PopoverPanel";

import { FilterIntegrationPicker } from "./FilterIntegrationPicker";

interface Props {
  onCreateRequest: (filter: NotificationFilter) => void;
  singleType?: NotificationFilter["__typename"];
}

export function NewFilterCreator({ singleType, onCreateRequest }: Props) {
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <UIHolder>
        <Button
          ref={buttonRef}
          tooltip="Add new filter..."
          kind="primarySubtle"
          icon={<IconPlus />}
          onClick={() => {
            if (singleType) {
              onCreateRequest({ __typename: singleType, id: getUUID() });
            } else {
              setIsCreatingNew(true);
            }
          }}
        >
          Add filter
        </Button>
      </UIHolder>
      <AnimatePresence>
        {isCreatingNew && (
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
                const filter: NotificationFilter = { __typename: integration.notificationTypename, id: getUUID() };
                setIsCreatingNew(false);
                onCreateRequest(filter);
              }}
            />
          </CompactPopoverPanel>
        )}
      </AnimatePresence>
    </>
  );
}

const UIHolder = styled.div``;

const CompactPopoverPanel = styled(PopoverPanel)``;
