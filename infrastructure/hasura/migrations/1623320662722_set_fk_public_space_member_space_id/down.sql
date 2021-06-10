alter table "public"."space_member" drop constraint "space_member_space_id_fkey",
          add constraint "space_participants_space_id_fkey"
          foreign key ("space_id")
          references "public"."space"
          ("id")
          on update restrict
          on delete restrict;
