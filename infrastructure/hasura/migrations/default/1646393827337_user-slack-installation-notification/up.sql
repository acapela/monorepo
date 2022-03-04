CREATE OR REPLACE FUNCTION public.user_slack_installation_team_id(installation_row user_slack_installation)
    RETURNS text
    LANGUAGE sql
    STABLE
AS
$function$
SELECT (installation_row.data -> 'team' ->> 'id')::text
$function$;

CREATE OR REPLACE FUNCTION public.user_slack_installation_team_name(installation_row user_slack_installation)
    RETURNS text
    LANGUAGE sql
    STABLE
AS
$function$
SELECT (installation_row.data -> 'team' ->> 'name')::text
$function$;

alter table "public"."notification_slack_message"
    add column "user_slack_installation_id" uuid
        null;

alter table "public"."notification_slack_message"
    add constraint "notification_slack_message_user_slack_installation_id_fkey"
        foreign key ("user_slack_installation_id")
            references "public"."user_slack_installation"
                ("id") on update cascade on delete cascade;

update notification_slack_message
set user_slack_installation_id = (
    select id
    from user_slack_installation
    where user_slack_installation.user_id = (
        select user_id
        from notification
        where id = notification_id)
    limit 1
)
where user_slack_installation_id is null;