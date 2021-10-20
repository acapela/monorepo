alter table "public"."topic" add constraint "slug" check (slug <> '');
