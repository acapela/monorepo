import { gql, useMutation, useQuery } from "@apollo/client";
import { Form, Formik, Field as FormikField, ErrorMessage } from "formik";
import React, { useState } from "react";
import { Button, ButtonVariant } from "../design/Button";
import { Dialog } from "../design/Dialog";
import { Field, FieldType } from "../design/Field";

export const InviteButton: React.FC<{ roomId: string; className?: string }> = ({ roomId, className }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const open = () => setDialogOpen(true);
  const close = () => setDialogOpen(false);

  return (
    <>
      <Dialog open={dialogOpen} onClose={close} aria-labelledby="participant-management-button">
        <h1 className="text-3xl mb-8">Manage invites</h1>
        <InviteTable roomId={roomId} />
        <InviteCreationForm roomId={roomId} />
      </Dialog>
      <Button
        variant={ButtonVariant.SECONDARY}
        block
        onClick={open}
        id="participant-management-button"
        className={className}
      >
        Invite
      </Button>
    </>
  );
};

const GET_ROOM_INVITES = gql`
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

const useRoomInvites = (roomId: string): InvitesUseResult => {
  const { data: { invites = [] } = {}, loading, error } = useQuery(GET_ROOM_INVITES, { variables: { roomId } });

  if (loading) {
    return { loading: true, invites: [], error: null };
  }

  if (error) {
    return { loading: false, invites: [], error };
  }

  return {
    loading: false,
    error: null,
    invites: invites.map((invite) => ({ id: invite.id, email: invite.email, used: !!invite.usedAt })),
  };
};

const InviteTable = ({ roomId }: { roomId: string }): JSX.Element => {
  const { loading, invites } = useRoomInvites(roomId);
  if (loading) {
    return <>Loading...</>; // TODO: use loader
  }
  if (!invites.length) {
    return <>No invites yet. Invite someone below.</>;
  }
  return (
    <ul>
      {invites.map((invite) => (
        <li key={invite.id}>
          {invite.email} - {invite.used ? "Invite accepted" : "Invite sent"}
        </li>
      ))}
    </ul>
  );
};

const CREATE_INVITE = gql`
  mutation CreateInvite($email: String!, $roomId: uuid) {
    invite: insert_room_invites_one(object: { email: $email, room_id: $roomId }) {
      id
      email
      usedAt: used_at
    }
  }
`;

interface InviteCreation {
  createInvite(invite: { email: string }): Promise<Invite>;
  loading: boolean;
  error?: Error;
}

const useInviteCreation = (roomId: string): InviteCreation => {
  const [createInvite, { loading, error }] = useMutation(CREATE_INVITE, {
    refetchQueries: [{ query: GET_ROOM_INVITES, variables: { roomId } }],
  });
  return {
    createInvite: async (args) => {
      const result = await createInvite({ variables: { ...args, roomId } });
      return {
        id: result.data.invite.id,
        email: result.data.invite.email,
        used: !!result.data.invite.usedAt,
      };
    },
    loading,
    error,
  };
};

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
        if (onCreate) {
          onCreate(invite);
        }
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="mb-4 mt-4">
            <label htmlFor="invite-email">Email</label>
            <FormikField name="email">
              {({ field }) => (
                <Field id="invite-email" type={FieldType.EMAIL} {...field} placeholder="friend@company.com" />
              )}
            </FormikField>
            <ErrorMessage name="email" component="div" />
          </div>
          <Button type={Button.Type.SUBMIT} disabled={loading || isSubmitting} variant={ButtonVariant.PRIMARY} block>
            Invite
          </Button>
        </Form>
      )}
    </Formik>
  );
};
