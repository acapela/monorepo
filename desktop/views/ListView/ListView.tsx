import { gql } from "@apollo/client";
import { uniqBy } from "lodash";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { deleteNotificationList, renameNotificationList } from "@aca/desktop/actions/lists";
import { apolloClient } from "@aca/desktop/apolloClient";
import { getDb } from "@aca/desktop/clientdb";
import { getIsNotificationsGroup, getNotificationsGroupMeta } from "@aca/desktop/domains/group/group";
import { getInboxListsById } from "@aca/desktop/domains/list/all";
import { getNotificationMeta } from "@aca/desktop/domains/notification/meta";
import { NotificationTag } from "@aca/desktop/domains/notification/tag";
import { OneTimeTip } from "@aca/desktop/domains/onboarding/OneTimeTip";
import { ActionSystemMenuItem } from "@aca/desktop/domains/systemMenu/ActionSystemMenuItem";
import { appViewContainerStyles } from "@aca/desktop/layout/Container";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { uiStore } from "@aca/desktop/store/ui";
import { DarkModeThemeProvider } from "@aca/desktop/styles/DesktopThemeProvider";
import { ListFiltersEditor } from "@aca/desktop/ui/Filters";
import { ListViewPreloader } from "@aca/desktop/views/ListView/ListViewPreloader";
import { UpdateSlackMessagesReadStatusMutation } from "@aca/gql";
import { assert } from "@aca/shared/assert";
import { createInterval } from "@aca/shared/time";
import { Button } from "@aca/ui/buttons/Button";
import { LazyChildrenRender } from "@aca/ui/performance/LazyChildrenRender";
import { theme } from "@aca/ui/theme";

import { ListViewFooter } from "./ListViewFooter";
import { NotificationRow } from "./NotificationRow";
import { NotificationsGroupRow } from "./NotificationsGroupRow";
import { TagFilters } from "./TagFilters";
import { ListViewTopBar } from "./Topbar";
import { ListViewZenOverlay } from "./ZenMode";
import { ZeroNotifications } from "./ZeroNotifications";

interface Props {
  listId: string;
}

const SLACK_READ_UPDATE_INTERVAL = 30000;

// Keep those 2 vars outside the component, so we can keep an interval across multiple instances of a list view for
// performance reasons

// Number of mounted list views, used to decide if we should keep a slack read update interval running
let mountedListCount = 0;
// Clear function for the slack read update interval, also used to check if an interval is currently running
let clearSlackReadUpdateInterval: (() => void) | undefined = undefined;

export const ListView = observer(({ listId }: Props) => {
  const [tagFilters, setTagFilters] = useState<NotificationTag[]>([]);
  const list = getInboxListsById(listId);

  const notificationGroups = list?.getGroups() ?? [];

  function getGroupsToShow() {
    if (!tagFilters.length) return notificationGroups;

    return notificationGroups.filter((group) => {
      const tags = getNotificationsGroupMeta(group).tags;

      if (!tags) return false;

      return tags.some((itemTag) => tagFilters.includes(itemTag));
    });
  }

  const notificationGroupsToShow = getGroupsToShow();

  const isInCelebrationMode = uiStore.isDisplayingZenImage;

  useEffect(() => {
    if (!list) return;

    mountedListCount++;

    list.listEntity?.update({ seen_at: new Date().toISOString() });

    if (!clearSlackReadUpdateInterval) {
      // No slack read update interval running, set it up!
      setupSlackReadUpdateInterval();
    }

    return () => {
      const listEntity = list.listEntity;
      if (listEntity && !listEntity.isRemoved()) {
        listEntity.update({ seen_at: new Date().toISOString() });
      }
      mountedListCount--;
    };
  }, [list]);

  useEffect(() => {
    // App got focused and we currently have no slack read update interval, create it!
    if (uiStore.isAppFocused && !clearSlackReadUpdateInterval) {
      setupSlackReadUpdateInterval();
    }
  }, [uiStore.isAppFocused]);

  useEffect(() => {
    if (isInCelebrationMode && notificationGroupsToShow.length > 0) {
      uiStore.isDisplayingZenImage = false;
    }
  }, [isInCelebrationMode, notificationGroupsToShow.length]);

  const updateSlackMessagesReadStatus = () => {
    // If there are no more list views or the app isn't focused when this gets called, delete the interval
    if (!mountedListCount || !uiStore.isAppFocused) {
      assert(clearSlackReadUpdateInterval, "Slack read status update interval running but no clear function set");
      clearSlackReadUpdateInterval();
      clearSlackReadUpdateInterval = undefined;
      return;
    }

    // Check if list contains unread slack messages, otherwise don't update
    const slackNotifications = list?.getAllNotifications();

    if (!slackNotifications) {
      return;
    }

    let conversationsInfo: { conversationId: string; slackInstallation: string }[] = [];

    const extractConversationInfoFromNotification = async (notificationId: string) => {
      const messageData = await getDb().notificationSlackMessage.findFirst({ notification_id: notificationId });

      if (!messageData || !messageData.user_slack_installation_id) {
        return;
      }

      conversationsInfo.push({
        conversationId: messageData.slack_conversation_id,
        slackInstallation: messageData.user_slack_installation_id,
      });
    };

    const collectConversationsInfo = async () => {
      for (const notification of slackNotifications) {
        const { tags } = getNotificationMeta(notification);

        if (tags?.some((tag) => tag.category === "read")) {
          // Notification already read, continue
          continue;
        }

        await extractConversationInfoFromNotification(notification.id);
      }
    };

    //Run the whole thing asynchronously as nothing depends on it
    collectConversationsInfo().then(() => {
      conversationsInfo = uniqBy(conversationsInfo, (data) => data.conversationId + data.slackInstallation);

      apolloClient.mutate<UpdateSlackMessagesReadStatusMutation>({
        mutation: gql`
          mutation UpdateSlackMessagesReadStatus($input: [ConversationInfo!]!) {
            result: update_slack_messages_read_status(input: $input) {
              success
            }
          }
        `,
        variables: { input: conversationsInfo },
        fetchPolicy: "no-cache",
      });
    });
  };

  const setupSlackReadUpdateInterval = () => {
    updateSlackMessagesReadStatus();
    clearSlackReadUpdateInterval = createInterval(updateSlackMessagesReadStatus, SLACK_READ_UPDATE_INTERVAL);
  };

  return (
    <TraySidebarLayout footer={<ListViewFooter />}>
      <ActionSystemMenuItem action={renameNotificationList} path={["List"]} target={list} />
      <ActionSystemMenuItem action={deleteNotificationList} path={["List"]} target={list} />

      {isInCelebrationMode && (
        <DarkModeThemeProvider>
          <UINotificationZeroHolder>
            <ListViewZenOverlay />
          </UINotificationZeroHolder>
        </DarkModeThemeProvider>
      )}
      <ListViewTopBar key={list?.id} list={list ?? undefined} />
      <UIHolder>
        {list?.listEntity && (
          <UIListTools>
            <ListFiltersEditor list={list.listEntity} />
          </UIListTools>
        )}

        {list?.tip && <OneTimeTip id={`${list.id}-tip`}>{list.tip}</OneTimeTip>}

        {list && !list.dontPreload && <ListViewPreloader list={list} />}

        <UIListsScroller>
          {list && !isInCelebrationMode && (notificationGroupsToShow?.length ?? 0) === 0 && (
            <ZeroNotifications key={listId} list={list} />
          )}

          {list && <TagFilters list={list} selectedTags={tagFilters} onChange={setTagFilters} />}

          {list && notificationGroupsToShow && notificationGroupsToShow.length > 0 && (
            <UINotifications>
              <LazyChildrenRender
                initialCount={300}
                addBatchSize={300}
                batchInterval={100}
                manualNextBatchTrigger={(loadMore) => {
                  return (
                    <UILoadMoreHolder>
                      <Button onClick={loadMore}>Show more</Button>
                    </UILoadMoreHolder>
                  );
                }}
              >
                {notificationGroupsToShow?.map((notificationOrGroup) => {
                  if (getIsNotificationsGroup(notificationOrGroup)) {
                    return <NotificationsGroupRow key={notificationOrGroup.id} group={notificationOrGroup} />;
                  }

                  return <NotificationRow key={notificationOrGroup.id} notification={notificationOrGroup} />;
                })}
              </LazyChildrenRender>
            </UINotifications>
          )}
        </UIListsScroller>
      </UIHolder>
    </TraySidebarLayout>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  min-height: 0;
  position: relative;
  ${theme.colors.layout.background.asBgWithReadableText}

  ${OneTimeTip} {
    margin: 24px 24px;
    align-self: center;
  }
`;

const UINotifications = styled.div`
  ${appViewContainerStyles};
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  padding-bottom: 192px;

  padding-top: 10px;
`;

const UINotificationZeroHolder = styled.div`
  position: absolute;
  display: block;
  inset: 0;
  display: flex;
  flex-direction: column;
  z-index: 2;
  overflow: hidden;
`;

const UIListTools = styled.div`
  ${appViewContainerStyles};
  display: flex;
  min-width: 0;
  ${theme.spacing.actions.asGap}
  padding-right: 16px;
  align-items: flex-start;

  padding-top: 16px;

  ${ListFiltersEditor} {
    flex-grow: 1;
  }
`;

const UIListsScroller = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
`;

const UILoadMoreHolder = styled.div`
  display: flex;
  padding: 20px;
  justify-content: center;
`;
