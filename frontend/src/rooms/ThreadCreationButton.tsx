import styled from "styled-components";
import React, { useState } from "react";
import { ErrorMessage, Field as FormikField, Form, Formik } from "formik";
import { Dialog } from "@acapela/frontend/design/Dialog";
import { useCreateThreadMutation } from "@acapela/frontend/gql";
import { createNextIndex } from "@acapela/frontend/rooms/order";
import { Button } from "@acapela/ui/button";
import { Field } from "@acapela/ui/field";

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
      <Dialog title={"Add agenda point"} open={dialogOpen} onClose={close} aria-labelledby="thread-creation-button">
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

const ThreadCreationForm: React.FC<{
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
