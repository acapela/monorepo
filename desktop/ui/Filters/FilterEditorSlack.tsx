import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import { IntegrationIcon } from "@aca/desktop/domains/integrations/IntegrationIcon";
import { slackIntegrationClient } from "@aca/desktop/domains/integrations/slack";
import { typedKeys } from "@aca/shared/object";
import { PopoverPanel } from "@aca/ui/popovers/PopoverPanel";

import { FilterEditorSlackDetails } from "./FilterEditorSlackDetails";
import { FilterLabel } from "./FilterLabel";
import { FilterKindEditorProps, NotificationFilterKind, unsafeAssertFilterType } from "./types";

type SlackFilter = NotificationFilterKind<"notification_slack_message">;

export const FilterEditorSlack = observer(({ filter, onChange, onRemoveRequest }: FilterKindEditorProps) => {
  unsafeAssertFilterType(filter!, "notification_slack_message");

  function handleFilterChange(changedFilter: SlackFilter) {
    if (!changedFilter.id) {
      onChange({ ...changedFilter, __typename: "notification_slack_message" });
      return;
    }
    const keys = typedKeys(changedFilter);

    // User de-selected all slack channels and people inside existing filter
    if (filter && keys.length === 2 && changedFilter.__typename && changedFilter.id) {
      onRemoveRequest?.(filter);
      return;
    }

    onChange({ ...changedFilter, __typename: "notification_slack_message" });
  }

  const [isOpened, setIsOpened] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  function toggleOpened() {
    setIsOpened(!isOpened);
  }

  return (
    <UIHolder ref={anchorRef}>
      <FilterLabel
        label="Slack"
        icon={<IntegrationIcon integrationClient={slackIntegrationClient} />}
        isFilled={!!filter}
        onClick={toggleOpened}
        onClearRequest={() => {
          if (filter) {
            onRemoveRequest(filter);
          }
        }}
      />
      <AnimatePresence>
        {isOpened && (
          <PopoverPanel anchorRef={anchorRef} onCloseRequest={() => setIsOpened(false)} enableScreenCover>
            <FilterEditorSlackDetails filter={filter ?? {}} onChange={handleFilterChange} />
          </PopoverPanel>
        )}
      </AnimatePresence>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
