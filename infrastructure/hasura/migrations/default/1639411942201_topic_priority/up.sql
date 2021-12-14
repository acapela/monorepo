CREATE TABLE "public"."priority"
(
  "name" TEXT NOT NULL,
  PRIMARY KEY ("name"),
  UNIQUE ("name")
);
COMMENT ON TABLE "public"."priority" IS E'ENUM-like for topic priorities';

INSERT INTO "public"."priority" ("name")
VALUES ('low'),
       ('medium'),
       ('high'),
       ('critical');

ALTER TABLE "public"."topic"
  ADD COLUMN "priority" TEXT
    NULL;

ALTER TABLE "public"."topic"
  ADD CONSTRAINT "topic_priority_fkey"
    FOREIGN KEY ("priority")
      REFERENCES "public"."priority"
        ("name") ON UPDATE CASCADE ON DELETE SET NULL;
