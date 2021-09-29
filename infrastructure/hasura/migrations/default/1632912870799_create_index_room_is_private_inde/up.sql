CREATE  INDEX "room_is_private_index" on
  "public"."room" using btree ("is_private");
