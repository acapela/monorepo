import React, { useState } from "react";
import styled from "styled-components";

import { FreeTextInput } from "~ui/forms/FreeInputText";

import { SidebarLayout } from "./Layout";
import { SidebarContent } from "./sidebar/SidebarContent";

export function NewRequestView() {
  const [topicName, setTopicName] = useState<string>("");

  function handleSubmitTopicName(submittedTopicName: string) {
    setTopicName(submittedTopicName.trim());
  }

  return (
    <SidebarLayout sidebarContent={<SidebarContent />}>
      <UIHolder>
        <UITopicNameHolder>
          <UITopicNameInput value={topicName} onChangeText={handleSubmitTopicName} placeholder={"Add topic"} />
        </UITopicNameHolder>
      </UIHolder>
    </SidebarLayout>
  );
}

const UIHolder = styled.div<{}>``;

const UITopicNameHolder = styled.div<{}>`
  width: 600px;
`;

const UITopicNameInput = styled(FreeTextInput)<{}>`
  font-weight: 700;
  font-family: "Inter", sans-serif;

  font-size: 24px;
`;
