import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import styled from "styled-components";

import { useAppStateStore } from "@aca/frontend/appState/AppStateStore";
import { useDb } from "@aca/frontend/clientdb";
import { Modal } from "@aca/frontend/ui/Modal";
import { NewRequestView } from "@aca/frontend/views/NewRequestView";

export const NewTopicModalDisplayer = observer(function NewTopicModalDisplayer() {
  const appState = useAppStateStore();
  const db = useDb();

  function getTopicToDuplicateFrom() {
    const topicToDuplicateId = appState.creatingNewTopic?.duplicateFromTopicId;

    if (!topicToDuplicateId) return null;

    return db.topic.findById(topicToDuplicateId);
  }

  const isDuplicating = !!appState.creatingNewTopic?.duplicateFromTopicId;

  return (
    <AnimatePresence>
      {appState.creatingNewTopic && (
        <UIBody
          onCloseRequest={() => {
            appState.creatingNewTopic = null;
          }}
          head={{ title: isDuplicating ? "Duplicate request" : "New request" }}
        >
          <NewRequestView
            topicToDuplicate={getTopicToDuplicateFrom() ?? undefined}
            alwaysExpanded
            onTopicCreated={() => {
              appState.creatingNewTopic = null;
            }}
          />
        </UIBody>
      )}
    </AnimatePresence>
  );
});

const UIBody = styled(Modal)`
  && {
    width: 100%;
    max-width: 620px;
    max-height: calc(100vh - 60px);
  }
`;
