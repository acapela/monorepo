import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { DecisionOptionDraft } from "~frontend/topics/createRequest";
import { Button } from "~ui/buttons/Button";
import { CloseIconButton } from "~ui/buttons/CloseIconButton";
import { TextInput } from "~ui/forms/TextInput";
import { IconPlus } from "~ui/icons";
import { theme } from "~ui/theme";

interface DecisionEditorProps {
  options: DecisionOptionDraft[];
  onOptionsChange: (newOptions: DecisionOptionDraft[]) => void;
}

export const INITIAL_DECISION_OPTIONS: DecisionOptionDraft[] = [
  {
    index: 0,
    option: "Yes",
  },
  {
    index: 1,
    option: "No",
  },
];

export const DecisionEditor = observer(function DecisionEditor({ options, onOptionsChange }: DecisionEditorProps) {
  function addOption() {
    const maxIndex = Math.max(...options.map((option) => option.index));
    onOptionsChange([...options, { index: maxIndex + 1, option: `Option ${maxIndex + 2}` }]);
  }

  function removeOption(index: number) {
    onOptionsChange(options.filter((option) => option.index !== index));
  }

  function updateOption(optionToUpdate: DecisionOptionDraft) {
    const before = options.filter((option) => option.index < optionToUpdate.index);
    const after = options.filter((option) => option.index > optionToUpdate.index);

    onOptionsChange([...before, optionToUpdate, ...after]);
  }
  return (
    <UIHolder>
      <UITitle>@Decision Options</UITitle>
      <UIOptions>
        {options.map((option) => (
          <UIOption key={option.index}>
            <TextInput
              value={option.option}
              onChangeText={(text: string) => updateOption({ index: option.index, option: text })}
            />
            {option.index >= 2 && <CloseIconButton onClick={() => removeOption(option.index)} />}
          </UIOption>
        ))}
        <Button icon={<IconPlus />} iconAtStart={true} onClick={() => addOption()}>
          Add option
        </Button>
      </UIOptions>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  background-color: ${theme.colors.tags.decision.opacity(0.1)};
  min-height: 60px;
  padding: 20px;
  max-width: 300px;
`;

const UITitle = styled.h6<{}>`
  ${theme.typo.item.secondaryTitle};
  padding-bottom: 10px;
`;

const UIOptions = styled.div<{}>`
  display: flex;
  flex-direction: column;
  ${theme.spacing.actionsSection.asGap}
  width: 100%;
`;

const UIOption = styled.div<{}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
