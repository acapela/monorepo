alter table "public"."message_reaction" drop column "created_at";

drop index message_reaction.message_reaction_created_at_idx;

drop index task.task_created_at_idx;
drop index task.task_done_at_idx;

drop index attachment.attachment_created_at_idx;

drop index transcription.transcription_created_at_idx;

