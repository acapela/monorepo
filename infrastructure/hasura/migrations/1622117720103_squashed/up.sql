CREATE
EXTENSION IF NOT EXISTS pgcrypto;
CREATE
EXTENSION IF NOT EXISTS pg_trgm;

CREATE FUNCTION public.refresh_full_text_search() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    REFRESH
MATERIALIZED VIEW full_text_search;
RETURN NULL;
END $$;

CREATE TABLE public.attachment
(
    id            uuid                     DEFAULT public.gen_random_uuid() NOT NULL,
    created_at    timestamp with time zone DEFAULT now()                    NOT NULL,
    original_name text                                                      NOT NULL,
    mime_type     text                                                      NOT NULL
);

CREATE TABLE public.message_attachment
(
    message_id    uuid NOT NULL,
    attachment_id uuid NOT NULL
);

CREATE VIEW public.message_full_text AS
SELECT NULL::uuid AS id, NULL::uuid AS topic_id, NULL::uuid AS user_id, NULL::uuid AS transcription_id, NULL::text AS type, NULL::timestamp
        with time zone AS created_at,
        NULL ::text AS content_txt;

CREATE TABLE public.room
(
    id                  uuid                     DEFAULT public.gen_random_uuid() NOT NULL,
    creator_id          uuid                                                      NOT NULL,
    name                text,
    created_at          timestamp with time zone DEFAULT now()                    NOT NULL,
    deadline            timestamp with time zone DEFAULT now()                    NOT NULL,
    notification_job_id text,
    summary             text,
    finished_at         timestamp with time zone,
    space_id            uuid,
    slug                text                                                      NOT NULL
);

CREATE TABLE public.room_member
(
    room_id uuid NOT NULL,
    user_id uuid NOT NULL
);

CREATE TABLE public.topic
(
    id      uuid DEFAULT public.gen_random_uuid() NOT NULL,
    room_id uuid                                  NOT NULL,
    name    text,
    index   text                                  NOT NULL,
    slug    text                                  NOT NULL
);

CREATE TABLE public.transcription
(
    id             uuid                     DEFAULT public.gen_random_uuid() NOT NULL,
    created_at     timestamp with time zone DEFAULT now()                    NOT NULL,
    updated_at     timestamp with time zone DEFAULT now()                    NOT NULL,
    sonix_media_id text                                                      NOT NULL,
    transcript     jsonb,
    status         text                                                      NOT NULL
);

CREATE VIEW public.transcription_full_text AS
SELECT t.id                         AS transcription_id,
       string_agg(t.txt, ' '::text) AS transcript
FROM (SELECT transcription.id,
             (jsonb_array_elements((jsonb_array_elements((transcription.transcript -> 'transcript'::text)) ->
                                    'words'::text)) ->> 'text'::text) AS txt
      FROM public.transcription
      WHERE (transcription.status = 'completed'::text)) t
GROUP BY t.id;

CREATE
MATERIALIZED VIEW public.full_text_search AS
SELECT room.id                  AS room_id,
       room.name                AS room_name,
       room_member.user_id,
       topic.id                 AS topic_id,
       topic.name               AS topic_name,
       message.created_at       AS message_created_at,
       message.type             AS message_type,
       message.id               AS message_id,
       message.content_txt      AS message_content,
       transcription_full_text.transcription_id,
       attachment.id            AS attachment_id,
       attachment.original_name AS attachment_name,
       transcription_full_text.transcript
FROM ((((((public.room
    JOIN public.room_member ON ((room.id = room_member.room_id)))
    JOIN public.topic ON ((room.id = topic.room_id)))
    JOIN public.message_full_text message ON ((topic.id = message.topic_id)))
    LEFT JOIN public.message_attachment ma ON ((message.id = ma.message_id)))
    LEFT JOIN public.attachment ON ((ma.attachment_id = attachment.id)))
         LEFT JOIN public.transcription_full_text
                   ON ((message.transcription_id = transcription_full_text.transcription_id))) WITH NO DATA;

CREATE FUNCTION public.search_full_text(search text) RETURNS SETOF public.full_text_search
    LANGUAGE sql STABLE
    AS $$
SELECT *
FROM full_text_search
WHERE search <% (room_name || ' ' || topic_name || ' ' || COALESCE (message_content
    , '') || ' ' || COALESCE (transcript
    , '') || ' ' || COALESCE (attachment_name
    , ''))
ORDER BY
    similarity(search, (room_name || ' ' || topic_name || ' ' || COALESCE (message_content, '') || ' ' || COALESCE (transcript, '') || ' ' || COALESCE (attachment_name, ''))) DESC;
$$;

CREATE FUNCTION public.search_full_text_topic(search text) RETURNS SETOF public.full_text_search
    LANGUAGE sql STABLE
    AS $$
SELECT DISTINCT
ON (user_id, topic_id) *
FROM full_text_search
WHERE
    search
    <% (room_name || ' ' || topic_name || ' ' || COALESCE (message_content
    , '') || ' ' || COALESCE (transcript
    , '') || ' ' || COALESCE (attachment_name
    , ''));
$$;

CREATE FUNCTION public.set_current_timestamp_seen_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
_new record;
BEGIN
_new := NEW;
_new."seen_at" = NOW();
  RETURN _new;
END;
$$;

CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
_new record;
BEGIN
_new := NEW;
_new."updated_at" = NOW();
  RETURN _new;
END;
$$;

CREATE TABLE public.account
(
    id                   uuid                     DEFAULT public.gen_random_uuid() NOT NULL,
    created_at           timestamp with time zone DEFAULT now()                    NOT NULL,
    user_id              uuid                                                      NOT NULL,
    provider_id          text                                                      NOT NULL,
    provider_type        text                                                      NOT NULL,
    provider_account_id  text                                                      NOT NULL,
    refresh_token        text,
    access_token         text,
    access_token_expires timestamp with time zone,
    updated_at           timestamp with time zone DEFAULT now()                    NOT NULL
);

COMMENT
ON TABLE public.account IS 'Account represents 3rd party login methods used by given user.';

CREATE TABLE public.last_seen_message
(
    user_id    uuid                                   NOT NULL,
    topic_id   uuid                                   NOT NULL,
    message_id uuid                                   NOT NULL,
    seen_at    timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.membership_status
(
    value text NOT NULL
);

CREATE TABLE public.message
(
    topic_id         uuid                                                      NOT NULL,
    user_id          uuid                                                      NOT NULL,
    created_at       timestamp with time zone DEFAULT now()                    NOT NULL,
    type             text                                                      NOT NULL,
    id               uuid                     DEFAULT public.gen_random_uuid() NOT NULL,
    is_draft         boolean                  DEFAULT false                    NOT NULL,
    content          jsonb                    DEFAULT jsonb_build_array()      NOT NULL,
    transcription_id uuid
);

CREATE TABLE public.message_type
(
    value text NOT NULL
);

COMMENT
ON TABLE public.message_type IS 'Used as an ENUM for the message type field constraint.';
CREATE TABLE public.room_invites
(
    id         uuid                     DEFAULT public.gen_random_uuid() NOT NULL,
    room_id    uuid                                                      NOT NULL,
    inviter_id uuid                                                      NOT NULL,
    code       uuid                     DEFAULT public.gen_random_uuid() NOT NULL,
    email      text                                                      NOT NULL,
    created_at timestamp with time zone DEFAULT now()                    NOT NULL,
    used_at    timestamp with time zone
);

CREATE TABLE public.space
(
    id         uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name       text                                  NOT NULL,
    creator_id uuid                                  NOT NULL,
    team_id    uuid                                  NOT NULL,
    slug       text                                  NOT NULL
);

CREATE TABLE public.space_member
(
    space_id uuid NOT NULL,
    user_id  uuid NOT NULL
);

CREATE TABLE public.team
(
    id       uuid DEFAULT public.gen_random_uuid() NOT NULL,
    slug     text                                  NOT NULL,
    name     text                                  NOT NULL,
    owner_id uuid                                  NOT NULL
);

CREATE TABLE public.team_invitation
(
    id               uuid                     DEFAULT public.gen_random_uuid() NOT NULL,
    email            text                                                      NOT NULL,
    used_at          date,
    token            uuid                     DEFAULT public.gen_random_uuid() NOT NULL,
    created_at       timestamp with time zone DEFAULT now()                    NOT NULL,
    inviting_user_id uuid                                                      NOT NULL,
    team_id          uuid                                                      NOT NULL
);

CREATE TABLE public.team_member
(
    team_id uuid NOT NULL,
    user_id uuid NOT NULL
);

CREATE TABLE public.topic_member
(
    topic_id uuid NOT NULL,
    user_id  uuid NOT NULL
);

CREATE TABLE public.transcription_status
(
    value text NOT NULL
);

CREATE VIEW public.unread_messages AS
SELECT sm.user_id,
       room.id           AS room_id,
       topic.id          AS topic_id,
       count(message.id) AS unread_messages
FROM ((((public.space_member sm
    LEFT JOIN public.room ON ((room.space_id = sm.space_id)))
    LEFT JOIN public.topic ON ((topic.room_id = room.id)))
    LEFT JOIN public.last_seen_message ON (((last_seen_message.user_id = sm.user_id) AND
                                            (last_seen_message.topic_id = topic.id))))
         LEFT JOIN public.message ON ((message.topic_id = topic.id)))
WHERE ((message.created_at > last_seen_message.seen_at) OR (last_seen_message.seen_at IS NULL))
GROUP BY sm.user_id, room.id, topic.id
ORDER BY sm.user_id, room.id, topic.id;

CREATE TABLE public."user"
(
    id              uuid                     DEFAULT public.gen_random_uuid() NOT NULL,
    email           text,
    name            text,
    avatar_url      text,
    created_at      timestamp with time zone DEFAULT now()                    NOT NULL,
    email_verified  timestamp with time zone,
    current_team_id uuid
);

CREATE TABLE public.verification_requests
(
    id         uuid                     DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now()                    NOT NULL,
    updated_at timestamp with time zone DEFAULT now()                    NOT NULL,
    identifier text                                                      NOT NULL,
    token      text                                                      NOT NULL,
    expires    timestamp with time zone                                  NOT NULL
);

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.attachment
    ADD CONSTRAINT attachment_id_key UNIQUE (id);

ALTER TABLE ONLY public.attachment
    ADD CONSTRAINT attachment_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.last_seen_message
    ADD CONSTRAINT last_seen_message_pkey PRIMARY KEY (user_id, topic_id);

ALTER TABLE ONLY public.message_attachment
    ADD CONSTRAINT message_attachments_pkey PRIMARY KEY (message_id, attachment_id);

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_id_key UNIQUE (id);

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.message_type
    ADD CONSTRAINT message_type_pkey PRIMARY KEY (value);

ALTER TABLE ONLY public.room_invites
    ADD CONSTRAINT room_invites_code_key UNIQUE (code);

ALTER TABLE ONLY public.room_invites
    ADD CONSTRAINT room_invites_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.room_invites
    ADD CONSTRAINT room_invites_room_id_email_key UNIQUE (room_id, email);

ALTER TABLE ONLY public.room_member
    ADD CONSTRAINT room_participants_pkey PRIMARY KEY (room_id, user_id);

ALTER TABLE ONLY public.room_member
    ADD CONSTRAINT room_participants_room_id_user_id_key UNIQUE (room_id, user_id);

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_slug_space_id_key UNIQUE (slug, space_id);

ALTER TABLE ONLY public.space_member
    ADD CONSTRAINT space_participants_pkey PRIMARY KEY (space_id, user_id);

ALTER TABLE ONLY public.space
    ADD CONSTRAINT space_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.space
    ADD CONSTRAINT space_team_id_slug_key UNIQUE (team_id, slug);

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_id_key UNIQUE (id);

ALTER TABLE ONLY public.team_invitation
    ADD CONSTRAINT team_invitation_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.team_invitation
    ADD CONSTRAINT team_invitation_token_key UNIQUE (token);

ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT team_membership_pkey PRIMARY KEY (team_id, user_id);

ALTER TABLE ONLY public.membership_status
    ADD CONSTRAINT team_membership_status_pkey PRIMARY KEY (value);

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_slug_key UNIQUE (slug);

ALTER TABLE ONLY public.topic
    ADD CONSTRAINT thread_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.topic_member
    ADD CONSTRAINT topic_participants_pkey PRIMARY KEY (topic_id, user_id);

ALTER TABLE ONLY public.topic
    ADD CONSTRAINT topic_slug_room_id_key UNIQUE (slug, room_id);

ALTER TABLE ONLY public.transcription
    ADD CONSTRAINT transcription_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.transcription
    ADD CONSTRAINT transcription_sonix_media_id_key UNIQUE (sonix_media_id);

ALTER TABLE ONLY public.transcription_status
    ADD CONSTRAINT transcription_status_pkey PRIMARY KEY (value);

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.verification_requests
    ADD CONSTRAINT verification_requests_pkey PRIMARY KEY (id);

CREATE
INDEX full_text_search_idx ON public.full_text_search USING gin ((((((((((room_name || ' '::text) || topic_name) || ' '::text) || COALESCE(message_content, ''::text)) || ' '::text) || COALESCE(transcript, ''::text)) || ' '::text) || COALESCE(attachment_name, ''::text))) public.gin_trgm_ops);

CREATE
OR REPLACE VIEW public.message_full_text AS
SELECT message.id,
       message.topic_id,
       message.user_id,
       message.transcription_id,
       message.type,
       message.created_at,
       string_agg(t.content_txt, ' '::text) AS content_txt
FROM (public.message
    LEFT JOIN (SELECT message_1.id,
                      (jsonb_array_elements(message_1.content) ->> 'insert'::text) AS content_txt
               FROM public.message message_1
               WHERE (message_1.is_draft = false)) t ON ((t.id = message.id)))
GROUP BY message.id, message.topic_id, message.user_id, message.transcription_id, message.type;

CREATE TRIGGER refresh_search
    AFTER INSERT OR DELETE OR UPDATE OR TRUNCATE ON public.attachment FOR EACH STATEMENT
EXECUTE FUNCTION public.refresh_full_text_search();

CREATE TRIGGER refresh_search
    AFTER INSERT OR DELETE OR UPDATE OR TRUNCATE ON public.message FOR EACH STATEMENT
EXECUTE FUNCTION public.refresh_full_text_search();

CREATE TRIGGER refresh_search
    AFTER INSERT OR DELETE OR UPDATE OR TRUNCATE ON public.message_attachment FOR EACH STATEMENT
EXECUTE FUNCTION public.refresh_full_text_search();

CREATE TRIGGER refresh_search
    AFTER INSERT OR DELETE OR UPDATE OR TRUNCATE ON public.room FOR EACH STATEMENT
EXECUTE FUNCTION public.refresh_full_text_search();

CREATE TRIGGER refresh_search
    AFTER INSERT OR DELETE OR UPDATE OR TRUNCATE ON public.room_member FOR EACH STATEMENT
EXECUTE FUNCTION public.refresh_full_text_search();

CREATE TRIGGER refresh_search
    AFTER INSERT OR DELETE OR UPDATE OR TRUNCATE ON public.topic FOR EACH STATEMENT
EXECUTE FUNCTION public.refresh_full_text_search();

CREATE TRIGGER refresh_search
    AFTER INSERT OR DELETE OR UPDATE OR TRUNCATE ON public.transcription FOR EACH STATEMENT
EXECUTE FUNCTION public.refresh_full_text_search();

CREATE TRIGGER set_public_account_updated_at
    BEFORE UPDATE
    ON public.account
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

COMMENT
ON TRIGGER set_public_account_updated_at ON public.account IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE TRIGGER set_public_last_seen_message_seen_at
    BEFORE UPDATE
    ON public.last_seen_message
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_seen_at();

COMMENT
ON TRIGGER set_public_last_seen_message_seen_at ON public.last_seen_message IS 'trigger to set value of column "seen_at" to current timestamp on row update';

CREATE TRIGGER set_public_transcription_updated_at
    BEFORE UPDATE
    ON public.transcription
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

COMMENT
ON TRIGGER set_public_transcription_updated_at ON public.transcription IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE TRIGGER set_public_verification_requests_updated_at
    BEFORE UPDATE
    ON public.verification_requests
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

COMMENT
ON TRIGGER set_public_verification_requests_updated_at ON public.verification_requests IS 'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON
UPDATE CASCADE
ON
DELETE CASCADE;

ALTER TABLE ONLY public.message_attachment
    ADD CONSTRAINT message_attachments_attachment_id_fkey FOREIGN KEY (attachment_id) REFERENCES public.attachment(id) ON
UPDATE CASCADE
ON
DELETE CASCADE;

ALTER TABLE ONLY public.message_attachment
    ADD CONSTRAINT message_attachments_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.message(id) ON
UPDATE CASCADE
ON
DELETE CASCADE;

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_thread_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON
UPDATE CASCADE
ON
DELETE CASCADE;

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_transcription_id_fkey FOREIGN KEY (transcription_id) REFERENCES public.transcription(id) ON
UPDATE CASCADE
ON
DELETE RESTRICT;

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_type_fkey FOREIGN KEY (type) REFERENCES public.message_type(value) ON
UPDATE CASCADE
ON
DELETE RESTRICT;

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON
UPDATE CASCADE
ON
DELETE CASCADE;

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public."user"(id) ON
UPDATE CASCADE;

ALTER TABLE ONLY public.room_invites
    ADD CONSTRAINT room_invites_inviter_id_fkey FOREIGN KEY (inviter_id) REFERENCES public."user"(id) ON
UPDATE CASCADE
ON
DELETE CASCADE;

ALTER TABLE ONLY public.room_invites
    ADD CONSTRAINT room_invites_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(id) ON
UPDATE CASCADE
ON
DELETE CASCADE;

ALTER TABLE ONLY public.room_member
    ADD CONSTRAINT room_participants_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(id) ON
UPDATE CASCADE
ON
DELETE CASCADE;

ALTER TABLE ONLY public.room_member
    ADD CONSTRAINT room_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON
UPDATE CASCADE
ON
DELETE CASCADE;

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.space(id) ON
UPDATE RESTRICT
ON
DELETE RESTRICT;

ALTER TABLE ONLY public.space_member
    ADD CONSTRAINT space_participants_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.space(id) ON
UPDATE RESTRICT
ON
DELETE RESTRICT;

ALTER TABLE ONLY public.space_member
    ADD CONSTRAINT space_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON
UPDATE RESTRICT
ON
DELETE RESTRICT;

ALTER TABLE ONLY public.space
    ADD CONSTRAINT space_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id) ON
UPDATE RESTRICT
ON
DELETE RESTRICT;

ALTER TABLE ONLY public.team_invitation
    ADD CONSTRAINT team_invitation_inviting_user_id_fkey FOREIGN KEY (inviting_user_id) REFERENCES public."user"(id) ON
UPDATE RESTRICT
ON
DELETE RESTRICT;

ALTER TABLE ONLY public.team_invitation
    ADD CONSTRAINT team_invitation_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id) ON
UPDATE RESTRICT
ON
DELETE RESTRICT;

ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT team_membership_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id) ON
UPDATE RESTRICT
ON
DELETE RESTRICT;

ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT team_membership_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON
UPDATE RESTRICT
ON
DELETE RESTRICT;

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public."user"(id) ON
UPDATE RESTRICT
ON
DELETE RESTRICT;

ALTER TABLE ONLY public.topic
    ADD CONSTRAINT thread_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(id) ON
UPDATE CASCADE
ON
DELETE CASCADE;

ALTER TABLE ONLY public.topic_member
    ADD CONSTRAINT topic_participants_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON
UPDATE RESTRICT
ON
DELETE RESTRICT;

ALTER TABLE ONLY public.topic_member
    ADD CONSTRAINT topic_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON
UPDATE RESTRICT
ON
DELETE RESTRICT;

ALTER TABLE ONLY public.transcription
    ADD CONSTRAINT transcription_status_fkey FOREIGN KEY (status) REFERENCES public.transcription_status(value) ON
UPDATE CASCADE
ON
DELETE RESTRICT;

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_current_team_id_fkey FOREIGN KEY (current_team_id) REFERENCES public.team(id) ON
UPDATE RESTRICT
ON
DELETE RESTRICT;
