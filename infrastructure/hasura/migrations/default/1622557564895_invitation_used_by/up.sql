ALTER TABLE "public"."team_invitation" ADD COLUMN "used_by_user_id" uuid NULL;

alter table "public"."team_invitation"
           add constraint "team_invitation_used_by_user_id_fkey"
           foreign key ("used_by_user_id")
           references "public"."user"
           ("id") on update restrict on delete restrict;
