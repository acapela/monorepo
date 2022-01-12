import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { DecisionOptionDraft } from "@aca/frontend/message/decisions";
import { Button } from "@aca/ui/buttons/Button";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { TextInput } from "@aca/ui/forms/TextInput";
import { IconMinusCircle, IconPlus } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

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

export const DecisionEditor = observer(({ options, onOptionsChange }: DecisionEditorProps) => {
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
      <UITitle>New decision poll</UITitle>
      <UIOptions>
        {options.map((option) => (
          <UIOption key={option.index}>
            <TextInput
              value={option.option}
              placeholder={`Option ${option.index + 1}`}
              onChangeText={(text: string) => updateOption({ index: option.index, option: text })}
            />
            {option.index >= 2 && <UIMinusIconButton onClick={() => removeOption(option.index)} />}
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
  border: 1px solid ${theme.colors.layout.background.border};
  ${theme.radius.panel};
  padding: 20px;
  max-width: 400px;
  min-height: 60px;
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
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;

  > * {
    width: 100%;
  }
`;

const UIMinusIconButton = styled<Omit<React.ComponentProps<typeof IconButton>, "icon" | "kind">>((props) => (
  <IconButton kind="secondary" icon={<IconMinusCircle />} {...props} />
))`
  padding: 15px;
  width: auto;
`;
