import { AnimatePresence } from "framer-motion";
import { action } from "mobx";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { useElementHasOverflow } from "@aca/shared/hooks/useElementHasOverflow";
import { Button } from "@aca/ui/buttons/Button";
import { PopoverPanel } from "@aca/ui/popovers/PopoverPanel";
import { Tooltip } from "@aca/ui/popovers/Tooltip";
import { theme } from "@aca/ui/theme";

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
  const labelNameRef = useRef<HTMLDivElement>(null);

  const shouldShowFullTooltip = useElementHasOverflow(labelNameRef);

  return (
    <>
      <Tooltip
        anchorRef={labelRef}
        label={
          shouldShowFullTooltip ? (
            <UITooltipFullVersion>
              Edit or remove filter - <FilterDescriptionLabel filter={filter} />
            </UITooltipFullVersion>
          ) : (
            "Edit or remove filter..."
          )
        }
      />
      <UILabel ref={labelRef}>
        <Button
          icon={getFilterIntegration(filter)?.icon}
          onClick={action(() => {
            filtersEditStore.editedFilter = filter;
          })}
        >
          <UILabelParts ref={labelNameRef}>
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
              onRemove={onRemoveRequest}
              onCloseRequest={() => {
                filtersEditStore.editedFilter = null;
              }}
            />
          </CustomizePopoverPanel>
        )}
      </AnimatePresence>
    </>
  );
});

const UILabel = styled.div``;

const CustomizePopoverPanel = styled(PopoverPanel)`
  width: 460px;
`;

const ensureSpacesBetweenParts = css`
  span {
    &:after {
      content: " ";
    }
    &:before {
      content: " ";
    }
  }
`;

const UITooltipFullVersion = styled.div`
  ${ensureSpacesBetweenParts}
`;

const UILabelParts = styled.div`
  overflow: hidden;
  max-width: 260px;
  ${theme.common.ellipsisText}

  /* Will put spaces between parts of label */
  span {
    &:after {
      content: " ";
    }
    &:before {
      content: " ";
    }
  }
`;
