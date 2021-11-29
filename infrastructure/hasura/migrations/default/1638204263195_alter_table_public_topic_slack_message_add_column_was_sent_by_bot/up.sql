alter table "public"."topic_slack_message" add column "was_sent_by_bot" boolean
 not null default 'False';
