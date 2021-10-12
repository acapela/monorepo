CREATE OR REPLACE FUNCTION public.dedupe_topic_slug()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  i INT := 2;
  chosen_slug TEXT := NEW.slug;
BEGIN
  WHILE EXISTS(SELECT * FROM topic WHERE team_id = NEW.team_id AND slug = NEW.slug AND id != NEW.id)
    LOOP
      NEW.slug = chosen_slug || '-' || i;
      i = i + 1;
    END LOOP;

  RETURN NEW;
END;
$function$;
