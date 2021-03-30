import React, { useState } from "react";
import styled from "styled-components";
import { gql } from "@apollo/client";
import { ErrorMessage, Field as FormikField, Form, Formik } from "formik";
import { Button } from "@acapela/ui/button";
import { Field } from "@acapela/ui/field";
import { Dialog } from "../design/Dialog";
import { GetRoomInvitesDocument, useCreateInviteMutation, useGetRoomInvitesQuery } from "../gql";

export const InviteButton: React.FC<{ roomId: string; className?: string }> = ({ roomId, className }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const open = () => setDialogOpen(true);
  const close = () => setDialogOpen(false);

  return (
    <>
      <Dialog
        title={"Manage invites"}
        open={dialogOpen}
        onClose={close}
        aria-labelledby="participant-management-button"
      >
        <InviteTable roomId={roomId} />
        <InviteCreationForm roomId={roomId} />
      </Dialog>
      <Button wide onClick={open} id="participant-management-button" className={className}>
        Invite
      </Button>
    </>
  );
};

gql`
  query GetRoomInvites($roomId: uuid!) {
    invites: room_invites(where: { room_id: { _eq: $roomId } }) {
      id
      email
      usedAt: used_at
    }
  }
`;

interface Invite {
  id: string;
  email: string;
  used: boolean;
}

export type InvitesLoaded = { loading: false; invites: Invite[]; error: null };
export type InvitesLoading = { loading: true; invites: Invite[]; error: null };
export type InvitesFailure = { loading: false; invites: Invite[]; error: Error };
export type InvitesUseResult = InvitesLoaded | InvitesLoading | InvitesFailure;

const InviteTable = ({ roomId }: { roomId: string }): JSX.Element => {
  const { loading, data } = useGetRoomInvitesQuery({ variables: { roomId } });
  if (loading) {
    return <>Loading...</>; // TODO: use loader
  }

  if (!data?.invites.length) {
    return <>No invites yet. Invite someone below.</>;
  }

  return (
    <ul>
      {data.invites.map((invite) => (
        <li key={invite.id}>
          {invite.email} - {invite.usedAt ? "Invite accepted" : "Invite sent"}
        </li>
      ))}
    </ul>
  );
};

gql`
  mutation CreateInvite($email: String!, $roomId: uuid) {
    invite: insert_room_invites_one(object: { email: $email, room_id: $roomId }) {
      id
      email
      usedAt: used_at
    }
  }
`;

interface InviteCreation {
  createInvite(invite: { email: string }): Promise<Invite | null>;

  loading: boolean;
  error?: Error;
}

const useInviteCreation = (roomId: string): InviteCreation => {
  const [createInvite, { loading, error }] = useCreateInviteMutation({
    refetchQueries: [{ query: GetRoomInvitesDocument, variables: { roomId } }],
  });
  return {
    createInvite: async (args) => {
      const result = await createInvite({ variables: { ...args, roomId } });

      const inviteData = result?.data?.invite;

      if (!inviteData) {
        return null;
      }

      return {
        id: inviteData.id,
        email: inviteData.email,
        used: !!inviteData.usedAt,
      };
    },
    loading,
    error,
  };
};

const UIEmailFieldWrapper = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const InviteCreationForm = ({
  roomId,
  onCreate,
}: {
  roomId: string;
  onCreate?: (invite: Invite) => void;
}): JSX.Element => {
  const { createInvite, loading } = useInviteCreation(roomId);

  return (
    <Formik
      initialValues={{ email: "" }}
      // TODO: validate
      onSubmit={async ({ email }, { resetForm }) => {
        const invite = await createInvite({ email });
        if (invite && onCreate) {
          onCreate(invite);
        }
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <UIEmailFieldWrapper>
            <label htmlFor="invite-email">Email</label>
            <FormikField name="email">
              {({ field }) => <Field id="invite-email" type="email" {...field} placeholder="friend@company.com" />}
            </FormikField>
            <ErrorMessage name="email" component="div" />
          </UIEmailFieldWrapper>
          <Button type="submit" disabled={loading || isSubmitting} wide>
            Invite
          </Button>
        </Form>
      )}
    </Formik>
  );
};
