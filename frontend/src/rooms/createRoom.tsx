import { useState } from "react";
import { Formik, Form, Field as FormikField, ErrorMessage } from "formik";
import { useRouter } from "next/router";

import { Button } from "@acapela/ui/button";
import { Field } from "@acapela/ui/field";
import { Dialog } from "../design/Dialog";
import { useCreateRoomMutation, Room } from "../gql";

export const RoomCreationForm: React.FC<{ onCreate?: (room: { id: string }) => unknown }> = ({ onCreate }) => {
  const [createRoom, { loading }] = useCreateRoomMutation();
  return (
    <Formik
      initialValues={{ name: "" }}
      // TODO: validate
      onSubmit={async ({ name }) => {
        const {
          data: { room },
        } = await createRoom({ variables: { name } });
        if (onCreate) {
          onCreate(room);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="mb-4">
            <label htmlFor="room-name">Title</label>
            <FormikField name="name">
              {({ field }) => <Field id="room-name" {...field} placeholder="How do we get to mars?" />}
            </FormikField>
            <ErrorMessage name="name" component="div" />
          </div>
          <Button disabled={loading || isSubmitting} wide>
            Create
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export const RoomCreationButton: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { push } = useRouter();

  const open = () => setDialogOpen(true);
  const close = () => setDialogOpen(false);

  const handleRoomCreation = (room: Room) => {
    push(`/rooms/${room.id}`);
  };

  return (
    <>
      <Dialog open={dialogOpen} onClose={close} aria-labelledby="acapela-creation-button">
        <h1 className="text-3xl mb-8">Create a new acapela</h1>
        <RoomCreationForm onCreate={handleRoomCreation} />
      </Dialog>
      <Button wide onClick={open} id="acapela-creation-button">
        Create New Acapela
      </Button>
    </>
  );
};
