alter table "public"."user" alter column "import_filters" set default ((((('[
    {
      "id": "'::text || gen_random_uuid()) || '",
      "__typename": "notification_slack_message",
      "conversation_type": {
        "$in": [
          "im",
          "mpim"
        ]
      }
    },
    {
      "id": "'::text) || gen_random_uuid()) || '",
      "__typename": "notification_slack_message",
      "is_mention": true
    }
  ]'::text))::jsonb;
alter table "public"."user" alter column "import_filters" drop not null;
alter table "public"."user" add column "import_filters" jsonb;
