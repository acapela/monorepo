CREATE TABLE "public"."topic_access_token"
(
  "id"       UUID NOT NULL DEFAULT gen_random_uuid(),
  "topic_id" UUID NOT NULL,
  "token"    UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("topic_id") REFERENCES "public"."topic" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;
