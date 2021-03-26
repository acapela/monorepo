import React, { useState } from "react";
import styled from "styled-components";
import { ErrorMessage, Field as FormikField, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { Button } from "@acapela/ui/button";
import { Field } from "@acapela/ui/field";
import { Dialog } from "../design/Dialog";
import { Room, useCreateRoomMutation } from "../gql";

const UIRoomTitleFieldWrapper = styled.div`
  margin-bottom: 1rem;
`;

export const RoomCreationForm: React.FC<{ onCreate?: (room: Room) => void }> = ({ onCreate }) => {
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
          <UIRoomTitleFieldWrapper>
            <label htmlFor="room-name">Title</label>
            <FormikField name="name">
              {({ field }) => <Field id="room-name" {...field} placeholder="How do we get to mars?" />}
            </FormikField>
            <ErrorMessage name="name" component="div" />
          </UIRoomTitleFieldWrapper>
          <Button type="submit" disabled={loading || isSubmitting} wide>
            Create
          </Button>
        </Form>
      )}
    </Formik>
  );
};

const UIRoomCreationDialogTitle = styled.h1`
  font-size: 1.875rem;
  line-height: 2.25rem;
  margin-bottom: 2rem;
`;

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
        <UIRoomCreationDialogTitle>Create a new acapela</UIRoomCreationDialogTitle>
        <RoomCreationForm onCreate={handleRoomCreation} />
      </Dialog>
      <Button wide onClick={open} id="acapela-creation-button">
        Create New Acapela
      </Button>
    </>
  );
};
