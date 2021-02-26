import { Form, Formik, Field as FormikField, ErrorMessage } from "formik";
import React, { ReactNode, useState } from "react";
import { AvatarList } from "../design/Avatar";
import { Button, ButtonVariant } from "../design/Button";
import { Dialog } from "../design/Dialog";
import { Field, FieldType } from "../design/Field";
import { SidebarLayout } from "../design/Layout";
import { NavLink } from "../design/NavLink";
import { createNextIndex } from "./order";
import { InviteButton } from "./invites";
import { RoomDetailedInfoFragment, useCreateThreadMutation } from "../gql";

interface Props {
  room: RoomDetailedInfoFragment;
  children: ReactNode;
}

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
            <InviteButton roomId={room.id} className="mt-2" />
            <nav className="mt-4">
              {(room.threads || []).map(({ id, name }, index) => (
                <NavLink key={id} to={`/rooms/${room.id}/threads/${id}`}>
                  {index + 1} {name}
                </NavLink>
              ))}
              <ThreadCreationButton
                roomId={room.id}
                lastThreadIndex={(room.threads || [])[room.threads.length - 1]?.index}
              />
            </nav>
          </>
        ),
      }}
    >
      {children}
    </SidebarLayout>
  );
};

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
        <h1 className="text-3xl mb-8">Add agenda point</h1>
        <ThreadCreationForm roomId={roomId} lastThreadIndex={lastThreadIndex} onCreate={handleThreadCreation} />
      </Dialog>
      <Button variant={ButtonVariant.SECONDARY} block onClick={open} id="thread-creation-button">
        Add agenda point
      </Button>
    </>
  );
};

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
          <div className="mb-4">
            <label htmlFor="thread-name">Name</label>
            <FormikField name="name">
              {({ field }) => (
                <Field id="thread-name" type={FieldType.TEXT} {...field} placeholder="How do we get to mars?" />
              )}
            </FormikField>
            <ErrorMessage name="name" component="div" />
          </div>
          <Button type={Button.Type.SUBMIT} disabled={loading || isSubmitting} variant={ButtonVariant.PRIMARY} block>
            Create
          </Button>
        </Form>
      )}
    </Formik>
  );
};
