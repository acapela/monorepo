import { JSONContent } from "@tiptap/core/dist/packages/core/src/types";
import { sortBy } from "lodash";
import { observer } from "mobx-react";
import React, { useMemo, useState } from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { getUniqueRequestMentionDataFromContent } from "~shared/editor/mentions";
import { REQUEST_DECISION } from "~shared/types/mention";
import { Button } from "~ui/buttons/Button";
import { CloseIconButton } from "~ui/buttons/CloseIconButton";
import { TextInput } from "~ui/forms/TextInput";
import { IconPlus } from "~ui/icons";
import { theme } from "~ui/theme";

interface DecisionOptionValue {
  index: number;
  option: string;
}

interface DecisionEditorProps {
  controller: Controller;
}

const INITIAL_OPTIONS = [
  {
    index: 0,
    option: "Yes",
  },
  {
    index: 1,
    option: "No",
  },
];

interface DecisionControllerProps {
  content: JSONContent;
}

interface Controller {
  options: DecisionOptionValue[];
  addOption: () => void;
  removeOption: (index: number) => void;
  updateOption: (option: DecisionOptionValue) => void;
}

export const useDecisionController = function ({
  content,
}: DecisionControllerProps): [boolean, { controller: Controller; submit: (messageId: string) => void }] {
  const [options, setOptions] = useState<DecisionOptionValue[]>(INITIAL_OPTIONS);
  const db = useDb();

  const shouldShowDecision = useMemo(
    () => getUniqueRequestMentionDataFromContent(content).some((mention) => mention.type === REQUEST_DECISION),
    [content]
  );

  function submit(messageId: string) {
    if (!shouldShowDecision) {
      return;
    }

    sortBy(options, "index").forEach((option) => {
      db.decisionOption.createOrUpdate({
        index: option.index,
        option: option.option,
        message_id: messageId,
      });
    });
  }

  function addOption() {
    const maxIndex = Math.max(...options.map((option) => option.index));
    setOptions([...options, { index: maxIndex + 1, option: `Option ${maxIndex + 2}` }]);
  }

  function removeOption(index: number) {
    setOptions(options.filter((option) => option.index !== index));
  }

  function updateOption(optionToUpdate: DecisionOptionValue) {
    const before = options.filter((option) => option.index < optionToUpdate.index);
    const after = options.filter((option) => option.index > optionToUpdate.index);

    setOptions([...before, optionToUpdate, ...after]);
  }

  return [
    shouldShowDecision,
    {
      controller: {
        options,
        addOption,
        removeOption,
        updateOption,
      },
      submit,
    },
  ];
};

export const DecisionEditor = observer(function DecisionEditor({ controller }: DecisionEditorProps) {
  return (
    <UIHolder>
      <UITitle>@Decision Options</UITitle>
      <UIOptions>
        {controller.options.map((option) => (
          <UIOption key={option.index}>
            <TextInput
              value={option.option}
              onChangeText={(text: string) => controller.updateOption({ index: option.index, option: text })}
            />
            {option.index >= 2 && <CloseIconButton onClick={() => controller.removeOption(option.index)} />}
          </UIOption>
        ))}
        <Button icon={<IconPlus />} iconAtStart={true} onClick={() => controller.addOption()}>
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
