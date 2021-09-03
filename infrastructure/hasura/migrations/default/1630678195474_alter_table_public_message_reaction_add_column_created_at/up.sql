alter table "public"."message_reaction" add column "created_at" timestamptz
 not null default now();

create index message_reaction_created_at_idx on "public"."message_reaction"("created_at");

create index task_created_at_idx on "public"."task"("created_at");
create index task_done_at_idx on "public"."task"("done_at");

create index attachment_created_at_idx on "public"."attachment"("created_at");

create index transcription_created_at_idx on "public"."transcription"("created_at");

