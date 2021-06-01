ALTER TABLE "public"."team_invitation" ADD COLUMN "used_by" uuid NULL;

alter table "public"."team_invitation"
           add constraint "team_invitation_used_by_fkey"
           foreign key ("used_by")
           references "public"."user"
           ("id") on update restrict on delete restrict;
