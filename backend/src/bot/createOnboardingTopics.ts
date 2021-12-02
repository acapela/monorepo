import { createTopicByBot } from "./botTopic";
import {
  getInitialTipsMessage,
  getSlackIntegrationTipsMessage,
  getWelcomeToAcapelaMessage,
} from "./onboardingMessages";

export async function createOnboardingTopicsWithBot(userId: string, teamId: string) {
  await createTopicByBot({
    teamId,
    topicName: "Welcome to Acapela!",
    messageContent: getWelcomeToAcapelaMessage(userId),
  });
  await createTopicByBot({
    teamId,
    topicName: "Tips to help you getting started",
    messageContent: getInitialTipsMessage(userId),
  });
  await createTopicByBot({
    teamId,
    topicName: "Try our Slack integration",
    messageContent: getSlackIntegrationTipsMessage(userId),
  });
}
