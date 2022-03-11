set session_replication_role to replica;

drop function team_slack_installation_scopes(team_slack_installation_row team_slack_installation) cascade;

drop function team_member_slack_scopes(team_member_slack_row team_member_slack) cascade;

drop view unread_messages;

drop table attachment, decision_option, decision_vote, last_seen_message, message,message_reaction,
    message_task_due_date, message_type, priority, slack_notification_queue, task, task_slack_message,
    team_member_slack, team_slack_installation, topic, topic_access_token, topic_event, topic_member,
    topic_slack_message, transcription, transcription_status, user_group, user_group_member cascade;

alter table team_member drop column notify_email, drop column notify_slack;