DELETE
FROM "user"
WHERE email IS NULL
   OR name IS NULL;

ALTER TABLE "public"."user"
  ALTER COLUMN "email" SET NOT NULL,
  ALTER COLUMN "name" SET NOT NULL;
