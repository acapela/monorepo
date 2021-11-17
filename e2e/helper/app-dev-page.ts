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

    // Wait for navigation to open topic page
    await this.page.waitForSelector(`[data-test-id="topic-title"]:has-text("${title}")`);
  }

  async selectTopicOption(optionTitle: string) {
    await this.page.click('[data-test-id="topic-options"]');
    await this.page.click(`[data-test-id="popover-menu-item"]:has-text("${optionTitle}")`);
  }

  async getSidebarRequestGroup(groupTitle: string) {
    return this.page.locator(`[data-test-id="sidebar-request-group-${groupTitle.toLowerCase().split(" ").join("-")}"]`);
  }

  async getSidebarRequestGroups() {
    return this.page.locator(`[data-test-id="sidebar-all-request-groups"]`);
  }

  async getSidebarTopicByName(name: string) {
    return (await this.getSidebarRequestGroups()).locator(`text=${name}`);
  }

  async writeInSearchBox(keyword: string) {
    return this.page.fill(`input[placeholder="Search by topic or person..."]`, keyword);
  }

  async waitForRequestInGroup(
    requestName: string,
    groupTitle: string,
    options?: { state?: "detached" | "attached"; strict?: boolean }
  ) {
    const groupSelector = `[data-test-id="sidebar-request-group-${groupTitle.toLowerCase().split(" ").join("-")}"]`;
    return await this.page.waitForSelector(`${groupSelector}:has-text("${requestName}")`, { ...options });
  }

  async waitForRequestInSidebar(requestName: string, options?: { state?: "detached" | "attached"; strict?: boolean }) {
    return await this.page.waitForSelector(`[data-test-id="sidebar-all-request-groups"]:has-text("${requestName}")`, {
      ...options,
    });
  }
}

type Username = string;
type MentionTypeLabel = string;
interface NewRequestProps {
  title?: string;
  mentions: Array<[MentionTypeLabel, Username]>;
  messageContent?: string;
}
