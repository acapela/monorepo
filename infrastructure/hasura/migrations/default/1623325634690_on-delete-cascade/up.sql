ALTER TABLE public.team_invitation
    DROP CONSTRAINT team_invitation_used_by_user_id_fkey;
ALTER TABLE ONLY public.team_invitation
    ADD CONSTRAINT team_invitation_used_by_user_id_fkey FOREIGN KEY (used_by_user_id) REFERENCES public.user (id) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;


ALTER TABLE public.message
    DROP CONSTRAINT message_transcription_id_fkey;
ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_transcription_id_fkey FOREIGN KEY (transcription_id) REFERENCES public.transcription(id) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;


ALTER TABLE public.message
    DROP CONSTRAINT message_type_fkey;
ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_type_fkey FOREIGN KEY (type) REFERENCES public.message_type(value) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;


ALTER TABLE public.room
    DROP CONSTRAINT room_creator_id_fkey;
ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public."user"(id) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;


ALTER TABLE public.room
    DROP CONSTRAINT room_space_id_fkey;
ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.space(id) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;


ALTER TABLE public.space_member
    DROP CONSTRAINT space_member_space_id_fkey;
ALTER TABLE ONLY public.space_member
    ADD CONSTRAINT space_member_space_id_fkey FOREIGN KEY (space_id) REFERENCES public.space(id) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;


ALTER TABLE public.space_member
    DROP CONSTRAINT space_participants_user_id_fkey;
ALTER TABLE ONLY public.space_member
    ADD CONSTRAINT space_member_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;


ALTER TABLE public.space
    DROP CONSTRAINT space_team_id_fkey;
ALTER TABLE ONLY public.space
    ADD CONSTRAINT space_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;


ALTER TABLE public.team_invitation
    DROP CONSTRAINT team_invitation_inviting_user_id_fkey;
ALTER TABLE ONLY public.team_invitation
    ADD CONSTRAINT team_invitation_inviting_user_id_fkey FOREIGN KEY (inviting_user_id) REFERENCES public."user"(id) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;


ALTER TABLE public.team_invitation
    DROP CONSTRAINT team_invitation_team_id_fkey;
ALTER TABLE ONLY public.team_invitation
    ADD CONSTRAINT team_invitation_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;


ALTER TABLE public.team_member
    DROP CONSTRAINT team_membership_team_id_fkey;
ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT team_membership_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;


ALTER TABLE public.team_member
    DROP CONSTRAINT team_membership_user_id_fkey;
ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT team_membership_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;


ALTER TABLE public.team
    DROP CONSTRAINT team_owner_id_fkey;
ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public."user"(id) ON
        UPDATE CASCADE
        ON
            DELETE RESTRICT;


ALTER TABLE public.topic_member
    DROP CONSTRAINT topic_member_topic_id_fkey;
ALTER TABLE ONLY public.topic_member
    ADD CONSTRAINT topic_member_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;


ALTER TABLE public.topic_member
    DROP CONSTRAINT topic_participants_user_id_fkey;
ALTER TABLE ONLY public.topic_member
    ADD CONSTRAINT topic_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;

ALTER TABLE public.transcription
    DROP CONSTRAINT transcription_status_fkey;
ALTER TABLE ONLY public.transcription
    ADD CONSTRAINT transcription_status_fkey FOREIGN KEY (status) REFERENCES public.transcription_status(value) ON
        UPDATE CASCADE
        ON
            DELETE CASCADE;

