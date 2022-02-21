import React from "react";
import styled from "styled-components";

import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { Button } from "@aca/ui/buttons/Button";
import { IconCheck, IconTrash } from "@aca/ui/icons";

import { FilterEditorFigma } from "./FilterEditorFigma";
import { FilterEditorLinear } from "./FilterEditorLinear";
import { FilterEditorNotion } from "./FilterEditorNotion";
import { FilterEditorSlack } from "./FilterEditorSlack";
import { IntegrationHeader } from "./IntergrationHeader";
import { getIsFilterOfType } from "./types";
import { getFilterIntegration } from "./utils";

interface Props {
  filter: NotificationFilter;
  onChange: (filter: NotificationFilter) => void;
  onCloseRequest: () => void;
  onRemove?: (filter: NotificationFilter) => void;
  saveLabel?: string;
}

export function FilterEditor({ filter, onChange, onRemove, onCloseRequest }: Props) {
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
    const targetIntegration = getFilterIntegration(filter);

    if (!targetIntegration) return null;

    return <IntegrationHeader service={targetIntegration} />;
  }

  const editor = renderCorrespondingEditor();

  return (
    <UIHolder>
      {renderIntegrationHeader()}
      {editor}
      <UIButtons>
        <Button isWide kind="primary" icon={<IconCheck />} onClick={onCloseRequest}>
          Done
        </Button>
        {onRemove && (
          <Button
            isWide
            icon={<IconTrash />}
            kind="primarySubtle"
            onClick={() => {
              onRemove(filter);
            }}
          >
            Remove filter
          </Button>
        )}
      </UIButtons>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const UIButtons = styled.div`
  display: flex;
  gap: 8px;
`;
