CREATE INDEX linear_issue_updated_at_idx ON linear_issue(updated_at);
CREATE INDEX notification_updated_at_idx ON notification(updated_at);
CREATE INDEX notification_figma_comment_updated_at_idx ON notification_figma_comment(updated_at);
CREATE INDEX notification_jira_issue_updated_at_idx ON notification_jira_issue(updated_at);
CREATE INDEX notification_linear_updated_at_idx ON notification_linear(updated_at);
CREATE INDEX notification_list_updated_at_idx ON notification_list(updated_at);
CREATE INDEX notification_notion_updated_at_idx ON notification_notion(updated_at);
CREATE INDEX notification_notion_commented_updated_at_idx ON notification_notion_commented(updated_at);
CREATE INDEX notification_notion_user_invited_updated_at_idx ON notification_notion_user_invited(updated_at);
CREATE INDEX notification_notion_user_mentioned_updated_at_idx ON notification_notion_user_mentioned(updated_at);
CREATE INDEX notification_slack_message_updated_at_idx ON notification_slack_message(updated_at);
CREATE INDEX notion_space_updated_at_idx ON notion_space(updated_at);
CREATE INDEX notion_space_user_updated_at_idx ON notion_space_user(updated_at);
CREATE INDEX user_slack_channels_by_team_updated_at_idx ON user_slack_channels_by_team(updated_at);
