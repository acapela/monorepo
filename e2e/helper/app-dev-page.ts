import { Locator, Page } from "@playwright/test";

import { basePath } from "./constants";

export class AppDevPage {
  readonly page: Page;
  readonly newRequestLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newRequestLocator = page.locator("text=New Request");
  }

  async goToNewRequestPage() {
    await this.page.goto(basePath);
  }

  async makeNewRequest({
    mentions,
    title = "a new test request",
    messageContent = "What is happening",
  }: NewRequestProps) {
    await this.goToNewRequestPage();
    await this.page.fill(`[placeholder="e.g. Feedback for new website copy"]`, title);

    await this.page.fill('[contenteditable="true"]', messageContent);

    for (const [mentionType, username] of mentions) {
      await this.page.type('[contenteditable="true"]', " @");
      await this.page.click(`[role="option"]:has-text("${username}")`);
      await this.page.click("text=" + mentionType);
    }

    await this.page.click('button:has-text("Send request")');
  }
}

type Username = string;
type MentionTypeLabel = string;
interface NewRequestProps {
  title?: string;
  mentions: Array<[MentionTypeLabel, Username]>;
  messageContent?: string;
}
