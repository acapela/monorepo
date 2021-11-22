import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { DropFileContext } from "~richEditor/DropFileContext";

import { NewRequest } from "./NewRequest";

interface Props {
  topicToDuplicate?: TopicEntity;
}

export const NewRequestView = observer(function NewRequestView({ topicToDuplicate }: Props) {
  return (
    <>
      <UIDropFileHolder>
        <NewRequest topicToDuplicate={topicToDuplicate} />
      </UIDropFileHolder>
    </>
  );
});

const UIDropFileHolder = styled(DropFileContext)<{}>`
  height: 100%;
  width: 100%;
`;
