alter table "public"."message_reaction" drop constraint "message_reaction_pkey";
alter table "public"."message_reaction"
    add constraint "message_reaction_pkey"
    primary key ("message_id", "emoji", "user_id");
