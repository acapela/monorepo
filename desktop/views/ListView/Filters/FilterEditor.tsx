import React from "react";
import styled from "styled-components";

import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { integrationClientList } from "@aca/desktop/domains/integrations";
import { Button } from "@aca/ui/buttons/Button";

import { FilterEditorFigma } from "./FilterEditorFigma";
import { FilterEditorLinear } from "./FilterEditorLinear";
import { FilterEditorNotion } from "./FilterEditorNotion";
import { FilterEditorSlack } from "./FilterEditorSlack";
import { IntegrationHeader } from "./IntergrationHeader";
import { getIsFilterOfType } from "./types";

interface Props {
  filter: NotificationFilter;
  onChange: (filter: NotificationFilter) => void;
  onSubmit: (filter: NotificationFilter) => void;
}

export function FilterEditor({ filter, onChange, onSubmit }: Props) {
  function renderCorrespondingEditor() {
    if (getIsFilterOfType(filter, "notification_figma_comment")) {
      return <FilterEditorFigma filter={filter} onChange={onChange} />;
    }

    if (getIsFilterOfType(filter, "notification_linear")) {
      return <FilterEditorLinear filter={filter} onChange={onChange} />;
    }

    if (getIsFilterOfType(filter, "notification_notion")) {
      return <FilterEditorNotion filter={filter} onChange={onChange} />;
    }

    if (getIsFilterOfType(filter, "notification_slack_message")) {
      return <FilterEditorSlack filter={filter} onChange={onChange} />;
    }

    return null;
  }

  function renderIntegrationHeader() {
    const targetIntegration = integrationClientList.find(
      (integration) => integration.notificationTypename === filter.__typename
    );

    if (!targetIntegration) return null;

    return <IntegrationHeader service={targetIntegration} />;
  }

  const editor = renderCorrespondingEditor();

  return (
    <UIHolder>
      {renderIntegrationHeader()}
      {editor}
      <Button
        isWide
        kind="primary"
        onClick={() => {
          onSubmit(filter);
        }}
      >
        Add filter
      </Button>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
