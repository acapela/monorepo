import styled from "styled-components";

import { FilterEditorFigma } from "./FilterEditorFigma";
import { FilterEditorLinear } from "./FilterEditorLinear";
import { FilterEditorNotion } from "./FilterEditorNotion";
import { FilterEditorSlack } from "./FilterEditorSlack";
import { NotificationFilter, getIsFilterOfType } from "./types";

interface Props {
  filter: NotificationFilter;
  onChange: (filter: NotificationFilter) => void;
}

export function FilterEditor({ filter, onChange }: Props) {
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

  const editor = renderCorrespondingEditor();

  return <UIHolder>{editor}</UIHolder>;
}

const UIHolder = styled.div``;
