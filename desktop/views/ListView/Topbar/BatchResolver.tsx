import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { resolveAllNotifications } from "@aca/desktop/actions/lists";
import { resolveNotification } from "@aca/desktop/actions/notification";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { groupNotifications } from "@aca/desktop/domains/group/groupNotifications";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { runActionWith } from "@aca/desktop/domains/runAction";
import { NotificationTagDisplayer } from "@aca/desktop/domains/tag/NotificationTag";
import { TagLabel } from "@aca/desktop/domains/tag/TagLabel";
import { uiStore } from "@aca/desktop/store/ui";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { pluralize } from "@aca/shared/text/pluralize";
import { IconUser } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { collectFromInfo } from "./collectFrom";

interface Props {
  list: NotificationsList;
}

function resolveMultiple(notifications: NotificationEntity[]) {
  runInAction(() => {
    /**
     * ! This is important. If we don't do that - currently UI focused notification will be resolved as well
     */
    uiStore.focusedTarget = null;
    runActionWith(resolveNotification, notifications);
  });
}

export const BatchResolver = observer(({ list }: Props) => {
  const allTags = list.collectTags();

  const fromInfo = collectFromInfo(list.getAllNotifications());

  return (
    <UIHolder>
      {allTags.length > 0 && (
        <UISection>
          <UITitle>Resolve all notifications with tag:</UITitle>
          <UITagsList>
            {allTags.map((info) => {
              const count = groupNotifications(info.usedBy).length;
              return (
                <NotificationTagDisplayer
                  key={info.tag.id}
                  tag={info.tag}
                  onClick={() => {
                    resolveMultiple(info.usedBy);
                  }}
                  tooltip={pluralize`Resolve ${count} ${["notification"]}`}
                />
              );
            })}
          </UITagsList>
        </UISection>
      )}
      <UISection>
        <UITitle>Resolve all notifications from:</UITitle>
        <UITagsList>
          {fromInfo.map(({ from, notifications }) => {
            const count = groupNotifications(notifications).length;
            return (
              <TagLabel
                label={from}
                icon={<IconUser />}
                key={from}
                onClick={() => {
                  resolveMultiple(notifications);
                }}
                tooltip={pluralize`Resolve ${count} ${["notification"]}`}
              />
            );
          })}
        </UITagsList>
      </UISection>

      <UISection>
        <ActionButton isWide kind="primary" action={resolveAllNotifications} target={list}></ActionButton>
      </UISection>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 450px;
  width: 100%;
`;

const UISection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  & + & {
    border-top: 1px solid ${theme.colors.layout.divider.value};
    padding-top: 16px;
  }
`;

const UITitle = styled.div`
  ${theme.typo.bodyTitle.secondary}
`;

const UITagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
