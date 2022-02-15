import { AnimatePresence } from "framer-motion";
import { action } from "mobx";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { Button } from "@aca/ui/buttons/Button";
import { PopoverPanel } from "@aca/ui/popovers/PopoverPanel";

import { FilterDescriptionLabel } from "./FilterDescriptionLabel";
import { FilterEditor } from "./FilterEditor";
import { filtersEditStore } from "./store";
import { getFilterIntegration } from "./utils";

interface Props {
  filter: NotificationFilter;
  onChange: (filter: NotificationFilter) => void;
  onRemoveRequest: (filter: NotificationFilter) => void;
}

export const FilterLabel = observer(function FilterLabel({ filter, onChange, onRemoveRequest }: Props) {
  const isEdited = filtersEditStore.editedFilter?.id === filter.id;
  const labelRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <UILabel ref={labelRef}>
        <Button
          icon={getFilterIntegration(filter)?.icon}
          onClick={action(() => {
            filtersEditStore.editedFilter = filter;
          })}
        >
          <UILabelParts>
            <FilterDescriptionLabel filter={filter} />
          </UILabelParts>
        </Button>
      </UILabel>
      <AnimatePresence>
        {isEdited && (
          <CustomizePopoverPanel
            enableScreenCover
            placement="bottom-start"
            anchorRef={labelRef}
            onCloseRequest={() => {
              filtersEditStore.editedFilter = null;
            }}
          >
            <FilterEditor
              filter={filter}
              onChange={(filter) => {
                onChange(filter);
              }}
              onSubmit={(filter) => {
                onChange(filter);
                filtersEditStore.editedFilter = null;
              }}
              onRemove={onRemoveRequest}
              saveLabel="Save"
            />
          </CustomizePopoverPanel>
        )}
      </AnimatePresence>
    </>
  );
});

const UILabel = styled.div``;

const CustomizePopoverPanel = styled(PopoverPanel)`
  width: 400px;
`;

const UILabelParts = styled.div`
  display: flex;
  gap: 4px;
`;
