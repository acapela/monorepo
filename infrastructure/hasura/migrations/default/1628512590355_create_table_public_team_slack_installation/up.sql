CREATE TABLE "public"."team_slack_installation"
(
  "team_id"            UUID  NOT NULL,
  "data" JSONB NOT NULL,
  PRIMARY KEY ("team_id"),
  FOREIGN KEY ("team_id") REFERENCES "public"."team" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);
