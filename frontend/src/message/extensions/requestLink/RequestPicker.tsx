import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useDb } from "@aca/frontend/clientdb";
import { TopicEntity } from "@aca/frontend/clientdb/topic";
import { UserAvatar } from "@aca/frontend/ui/users/UserAvatar";
import { AutocompletePickerProps } from "@aca/richEditor/autocomplete/component";
import { EditorRequestLinkData } from "@aca/shared/types/editor";
import { EmptyStatePlaceholder } from "@aca/ui/empty/EmptyStatePlaceholder";
import { IconComments } from "@aca/ui/icons";
import { SelectList } from "@aca/ui/SelectList";
import { theme } from "@aca/ui/theme";

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
