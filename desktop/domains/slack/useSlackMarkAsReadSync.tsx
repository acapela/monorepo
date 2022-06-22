import { gql } from "@apollo/client";
import { uniqBy } from "lodash";
import { useEffect } from "react";

import { apolloClient } from "@aca/desktop/apolloClient";
import { getDb } from "@aca/desktop/clientdb";
import { uiStore } from "@aca/desktop/store/ui";
import { UpdateSlackMessagesReadStatusMutation } from "@aca/gql/generated";
import { assert } from "@aca/shared/assert";
import { createInterval } from "@aca/shared/time";

import { getInboxListsById } from "../list/all";

const SLACK_READ_UPDATE_INTERVAL = 30000;

let mountedComponentCount = 0;

let clearSlackReadUpdateInterval: (() => void) | undefined = undefined;

const useSlackMarkAsReadSync = (listId: string) => {
  const list = getInboxListsById(listId);

  useEffect(() => {
    mountedComponentCount++;

    return () => {
      mountedComponentCount--;
    };
  }, [list]);

  useEffect(() => {
    // App got focused and we currently have no slack read update interval, create it!
    if (uiStore.isAppFocused && !clearSlackReadUpdateInterval) {
      setupSlackReadUpdateInterval();
    }
  }, [uiStore.isAppFocused, list]);

  const updateSlackMessagesReadStatus = () => {
    // If there are no more list views or the app isn't focused when this gets called, delete the interval
    if (!mountedComponentCount || !uiStore.isAppFocused) {
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

    const extractConversationInfoFromNotification = async (notificationId: string) => {
      const messageData = await getDb().notificationSlackMessage.findFirst({ notification_id: notificationId });

      if (!messageData || !messageData.user_slack_installation_id) {
        return;
      }

      return {
        conversationId: messageData.slack_conversation_id,
        slackInstallation: messageData.user_slack_installation_id,
      };
    };

    const collectConversationsInfo = async () => {
      const conversationsInfo: { conversationId: string; slackInstallation: string }[] = [];

      for (const notification of slackNotifications) {
        if (notification.last_seen_at) {
          // Notification already read, continue
          continue;
        }

        const info = await extractConversationInfoFromNotification(notification.id);

        if (info) {
          conversationsInfo.push(info);
        }
      }

      return uniqBy(conversationsInfo, (data) => data.conversationId + data.slackInstallation);
    };

    //Run the whole thing asynchronously as nothing depends on it
    collectConversationsInfo().then((conversationsInfo) => {
      if (!conversationsInfo.length) {
        return;
      }

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
};

export default useSlackMarkAsReadSync;
