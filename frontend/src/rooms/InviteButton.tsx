import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Button } from "~ui/button";
import { Field } from "~ui/field";
import { Dialog } from "../design/Dialog";
import { useCreateInviteMutation, useGetRoomInvitesQuery } from "../gql";

export const InviteButton: React.FC<{ roomId: string; className?: string }> = ({ roomId, className }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const open = () => setDialogOpen(true);
  const close = () => setDialogOpen(false);

  return (
    <>
      <Dialog
        title={"Manage invites"}
        isOpened={dialogOpen}
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

const UIEmailFieldWrapper = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

interface FormProps {
  roomId: string;
  onCreated?: (inviteId: string) => void;
}

const InviteCreationForm = ({ roomId, onCreated }: FormProps): JSX.Element => {
  const [createInvite, { loading }] = useCreateInviteMutation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<{ email: string }>({ defaultValues: { email: "" } });

  const onSubmit = handleSubmit(async (formData) => {
    const createResult = await createInvite({ variables: { email: formData.email, roomId } });

    if (!createResult.data?.invite) return;

    onCreated?.(createResult.data.invite.id);

    reset();
  });

  // TODO: Show errors in UI (aca-258-handle-errors-on-the-fe)

  return (
    <form onSubmit={onSubmit}>
      <UIEmailFieldWrapper>
        <label htmlFor="invite-email">Email</label>

        <Field {...register("email", { required: true })} type="email" placeholder="friend@company.com" />
      </UIEmailFieldWrapper>
      <Button type="submit" disabled={loading || isSubmitting} wide>
        Invite
      </Button>
    </form>
  );
};
