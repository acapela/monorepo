
CREATE  INDEX "account_updated_at_key" on
  "public"."account" using btree ("updated_at");

CREATE  INDEX "attachment_updated_at_key" on
  "public"."attachment" using btree ("updated_at");

CREATE  INDEX "last_seen_message_updated_at_key" on
  "public"."last_seen_message" using btree ("updated_at");

CREATE  INDEX "message_reaction_updated_at_key" on
  "public"."message_reaction" using btree ("updated_at");

CREATE  INDEX "team_updated_at_key" on
  "public"."team" using btree ("updated_at");

CREATE  INDEX "team_member_updated_at_key" on
  "public"."team_member" using btree ("updated_at");

CREATE  INDEX "team_member_slack_installation_updated_at_key" on
  "public"."team_member_slack" using btree ("updated_at");

CREATE  INDEX "team_slack_installation_updated_at_key" on
  "public"."team_slack_installation" using btree ("updated_at");

CREATE  INDEX "transcription_updated_at_key" on
  "public"."transcription" using btree ("updated_at");

CREATE  INDEX "user_updated_at_key" on
  "public"."user" using btree ("updated_at");
