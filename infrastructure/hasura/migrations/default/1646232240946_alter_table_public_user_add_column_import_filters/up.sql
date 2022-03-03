alter table "public"."user" add column "import_filters" jsonb
 not null default ('[
    {
      "id": "' || gen_random_uuid() || '",
      "__typename": "notification_slack_message",
      "conversation_type": {
        "$in": [
          "im",
          "mpim"
        ]
      }
    },
    {
      "id": "' || gen_random_uuid() || '",
      "__typename": "notification_slack_message",
      "is_mention": true
    }
  ]')::jsonb;
