import { useState } from "react";
import { useKey } from "react-use";
import styled from "styled-components";
import { SpaceBasicInfoFragment } from "~frontend/gql";
import { useCreateSpaceMutation, useEditSpaceMutation } from "~frontend/gql/spaces";
import { slugify } from "~shared/slugify";
import { Button } from "~ui/button";
import { TextInput } from "~ui/forms/TextInput";
import { Modal } from "../Modal";

interface Props {
  onCloseRequest: () => void;
  space?: SpaceBasicInfoFragment;
  teamId?: string;
  onSuccess?: ({ spaceId }: { spaceId: string }) => void;
}

export const ManageSpaceModal = ({ space, teamId, onCloseRequest, onSuccess }: Props) => {
  const [createSpace] = useCreateSpaceMutation();
  const [editSpace] = useEditSpaceMutation();
  const [name, setName] = useState(space?.name ?? "");
  const isEditMode = !!space;
  const headTitle = isEditMode ? "Rename space" : "Create new space";
  const confirmButtonLabel = isEditMode ? "Rename" : "Create";

  useKey("Escape", () => onCloseRequest());
  useKey("Enter", () => onSave(), {}, [name]);

  async function onSave() {
    if (!name.trim()) {
      onCloseRequest();
      return;
    }

    let operationResult;

    if (isEditMode) {
      operationResult = await editSpace({ spaceId: space?.id, name });
    } else {
      operationResult = await createSpace({ name, teamId, slug: slugify(name) });
    }

    const { data: genericSpaceResult } = operationResult;
    const spaceId = genericSpaceResult?.space?.id;

    if (!spaceId) {
      onCloseRequest();
      return;
    }

    onCloseRequest();
    onSuccess?.({ spaceId });
  }

  return (
    <Modal
      head={{
        title: headTitle,
        description: "",
      }}
      onCloseRequest={onCloseRequest}
    >
      <UIContentWrapper>
        <TextInput autoFocus placeholder="Enter space name" value={name} onChangeText={(value) => setName(value)} />
        <Button onClick={onSave}>{confirmButtonLabel}</Button>
      </UIContentWrapper>
    </Modal>
  );
};

const UIContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  ${Button} {
    margin-top: 1rem;
  }
`;
