import { ErrorMessage, Field as FormikField, Form, Formik } from "formik";
import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import { Button } from "@acapela/ui/button";
import { Field } from "@acapela/ui/field";
import { AvatarList } from "../design/Avatar";
import { Dialog } from "../design/Dialog";
import { SidebarLayout } from "../design/Layout";
import { NavLink } from "../design/NavLink";
import { createNextIndex } from "./order";
import { InviteButton } from "./invites";
import { RoomDetailedInfoFragment, useCreateThreadMutation } from "../gql";

interface Props {
  room: RoomDetailedInfoFragment;
  children: ReactNode;
}

const UIStyledInviteButton = styled(InviteButton)`
  margin-top: 0.5rem;
`;

const UIThreadsWrapper = styled.div`
  margin-top: 1rem;

  /* ThreadCreationButton */
  ${Button} {
    margin-top: 0.5rem;
  } ;
`;

export const RoomLayout: React.FC<Props> = ({ room, children }) => {
  return (
    <SidebarLayout
      sidebar={{
        content: (
          <>
            <AvatarList
              avatars={(room.participants || [])
                .filter(({ user }) => user.avatarUrl || user.name)
                .map(({ user }) => ({ name: user.name, url: user.avatarUrl }))}
            />
            <UIStyledInviteButton roomId={room.id} />
            <UIThreadsWrapper>
              {(room.threads || []).map(({ id, name }, index) => (
                <NavLink key={id} to={`/rooms/${room.id}/threads/${id}`}>
                  {index + 1} {name}
                </NavLink>
              ))}
              <ThreadCreationButton
                roomId={room.id}
                lastThreadIndex={(room.threads || [])[room.threads.length - 1]?.index}
              />
            </UIThreadsWrapper>
          </>
        ),
      }}
    >
      {children}
    </SidebarLayout>
  );
};

const UIThreadCreationDialogTitle = styled.h1`
  font-size: 1.875rem;
  line-height: 2.25rem;
  margin-bottom: 2rem;
`;

export const ThreadCreationButton: React.FC<{ roomId: string; lastThreadIndex?: string }> = ({
  roomId,
  lastThreadIndex,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const open = () => setDialogOpen(true);
  const close = () => setDialogOpen(false);

  function handleThreadCreation() {
    close();
  }

  return (
    <>
      <Dialog open={dialogOpen} onClose={close} aria-labelledby="thread-creation-button">
        <UIThreadCreationDialogTitle>Add agenda point</UIThreadCreationDialogTitle>
        <ThreadCreationForm roomId={roomId} lastThreadIndex={lastThreadIndex} onCreate={handleThreadCreation} />
      </Dialog>
      <Button wide onClick={open} id="thread-creation-button">
        Add agenda point
      </Button>
    </>
  );
};

const UIThreadNameFieldWrapper = styled.div`
  margin-bottom: 1rem;
`;

export const ThreadCreationForm: React.FC<{
  roomId: string;
  onCreate?: (thread: { id: string }) => unknown;
  lastThreadIndex?: string;
}> = ({ onCreate, roomId, lastThreadIndex }) => {
  const [createThread, { loading }] = useCreateThreadMutation();
  return (
    <Formik
      initialValues={{ name: "" }}
      // TODO: validate
      onSubmit={async ({ name }) => {
        const index = createNextIndex(lastThreadIndex);
        const {
          data: { thread },
        } = await createThread({
          variables: {
            name,
            index,
            roomId,
          },
        });
        if (onCreate) {
          onCreate(thread);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <UIThreadNameFieldWrapper>
            <label htmlFor="thread-name">Name</label>
            <FormikField name="name">
              {({ field }) => <Field id="thread-name" type="text" {...field} placeholder="How do we get to mars?" />}
            </FormikField>
            <ErrorMessage name="name" component="div" />
          </UIThreadNameFieldWrapper>
          <Button type="submit" disabled={loading || isSubmitting} wide>
            Create
          </Button>
        </Form>
      )}
    </Formik>
  );
};
