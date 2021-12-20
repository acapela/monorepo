import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { TopicEntity } from "~frontend/clientdb/topic";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { AutocompletePickerProps } from "~richEditor/autocomplete/component";
import { EditorRequestLinkData } from "~shared/types/editor";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { IconComments } from "~ui/icons";
import { SelectList } from "~ui/SelectList";
import { theme } from "~ui/theme";

export const RequestPicker = observer(({ keyword, onSelect }: AutocompletePickerProps<EditorRequestLinkData>) => {
  const db = useDb();

  const foundTopics = db.topic.search(keyword);

  return (
    <SelectList<TopicEntity>
      items={foundTopics}
      noItemsPlaceholder={<EmptyStatePlaceholder description="No requests found" noSpacing icon={<IconComments />} />}
      keyGetter={(topic) => topic.id}
      onItemSelected={(topic) => {
        onSelect([{ requestId: topic.id, originalTopicName: topic.name }]);
      }}
      renderItem={(item) => <UISelectItem>{item.name}</UISelectItem>}
    />
  );
});

const UISelectItem = styled.div<{}>`
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap};

  ${UserAvatar} {
    font-size: 1.5rem;
  }
`;
