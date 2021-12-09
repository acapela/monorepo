import { createTopicByBot } from "./botTopic";
import {
  getInitialTipsMessage,
  getSlackIntegrationTipsMessage,
  getWelcomeToAcapelaMessage,
} from "./onboardingMessages";

export async function createOnboardingTopicsWithBot(userId: string, teamId: string) {
  // We want topics to show in proper order, thus we control created at date manually
  const timeNow = Date.now();
  await createTopicByBot({
    teamId,
    topicName: "Welcome to Acapela!",
    messageContent: getWelcomeToAcapelaMessage(userId),
    createdAt: new Date(timeNow + 3),
    emojiReaction: "🎓",
  });
  await createTopicByBot({
    teamId,
    topicName: "Tips to help you getting started",
    messageContent: getInitialTipsMessage(userId),
    createdAt: new Date(timeNow + 2),
    emojiReaction: "🎓",
  });
  await createTopicByBot({
    teamId,
    topicName: "Try our Slack integration",
    messageContent: getSlackIntegrationTipsMessage(userId),
    createdAt: new Date(timeNow + 1),
    emojiReaction: "🎓",
  });
}
