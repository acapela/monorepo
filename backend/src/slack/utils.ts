import { SlackInstallation } from "@aca/backend/src/slack/app";
import { UserSlackInstallation } from "@aca/db";

export const getSlackInstallationData = (userSlackInstallation: UserSlackInstallation) =>
  userSlackInstallation.data as unknown as SlackInstallation;
