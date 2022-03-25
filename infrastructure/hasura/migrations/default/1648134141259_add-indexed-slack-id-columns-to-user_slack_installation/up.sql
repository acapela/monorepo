alter table user_slack_installation
    add column slack_team_id text,
    add column slack_user_id text;

create index on user_slack_installation (slack_team_id);
create index on user_slack_installation (slack_user_id);

update user_slack_installation
set slack_team_id = (data -> 'team' ->> 'id')::text,
    slack_user_id = (data -> 'user' ->> 'id')::text;

alter table user_slack_installation
    alter column slack_team_id set not null,
    alter column slack_user_id set not null;
