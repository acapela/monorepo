create view private_room as select id, is_private, space_id from room where is_private = true;
