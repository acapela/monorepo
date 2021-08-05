CREATE OR REPLACE FUNCTION dedupe_space_slug() RETURNS TRIGGER AS
$$
DECLARE
  i INT := 2;
  chosen_slug TEXT := NEW.slug;
BEGIN
  WHILE EXISTS(SELECT * FROM space WHERE team_id = NEW.team_id AND slug = NEW.slug)
    LOOP
      NEW.slug = chosen_slug || '-' || i;
      i = i + 1;
    END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dedupe_space_slug
  BEFORE INSERT
  ON space
  FOR EACH ROW
EXECUTE PROCEDURE dedupe_space_slug();


CREATE OR REPLACE FUNCTION dedupe_room_slug() RETURNS TRIGGER AS
$$
DECLARE
  i INT := 2;
  chosen_slug TEXT := NEW.slug;
BEGIN
  WHILE EXISTS(SELECT * FROM room WHERE space_id = NEW.space_id AND slug = NEW.slug)
    LOOP
      NEW.slug = chosen_slug || '-' || i;
      i = i + 1;
    END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dedupe_room_slug
  BEFORE INSERT
  ON room
  FOR EACH ROW
EXECUTE PROCEDURE dedupe_room_slug();


CREATE OR REPLACE FUNCTION dedupe_topic_slug() RETURNS TRIGGER AS
$$
DECLARE
  i INT := 2;
  chosen_slug TEXT := NEW.slug;
BEGIN
  WHILE EXISTS(SELECT * FROM topic WHERE room_id = NEW.room_id AND slug = NEW.slug)
    LOOP
      NEW.slug = chosen_slug || '-' || i;
      i = i + 1;
    END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dedupe_topic_slug
  BEFORE INSERT
  ON topic
  FOR EACH ROW
EXECUTE PROCEDURE dedupe_topic_slug();
