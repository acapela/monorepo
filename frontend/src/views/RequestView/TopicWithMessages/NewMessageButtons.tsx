import { observer } from "mobx-react";
import styled from "styled-components";

import { Button } from "~frontend/../../ui/buttons/Button";
import { theme } from "~frontend/../../ui/theme";
import { TopicEntity } from "~frontend/clientdb/topic";

interface Props {
  topic: TopicEntity;
}

export const NewMessageButtons = observer(({ topic }: Props) => {
  return (
    <UIHolder>
      <Button shortcut={["Mod", "Enter"]}>Send</Button>
      <Button shortcut={["Mod", "C"]}>Complete</Button>
      <Button shortcut={["Mod", "X"]} kind="primary">
        Close request
      </Button>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  ${theme.spacing.horizontalActions.asGap};
`;
