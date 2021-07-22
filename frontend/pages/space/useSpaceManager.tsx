import { SpaceBasicInfoFragment } from "~gql";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { IconSelection } from "~ui/icons";
import { routes } from "~frontend/routes";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import {
  useEditSpaceMutation,
  useRemoveSpaceMemberMutation,
  useAddSpaceMemberMutation,
  isCurrentUserSpaceMember,
  deleteSpace,
} from "~frontend/gql/spaces";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { openUIPrompt } from "~frontend/utils/prompt";

export function useSpaceManager(space: SpaceBasicInfoFragment) {
  const spaceId = space.id;
  const user = useAssertCurrentUser();
  const isCurrentUserMember = isCurrentUserSpaceMember(space);

  const [addSpaceMember] = useAddSpaceMemberMutation();
  const [removeSpaceMember] = useRemoveSpaceMemberMutation();
  const [edit] = useEditSpaceMutation();

  async function join() {
    await addSpaceMember({ userId: user.id, spaceId });
  }

  async function leave() {
    await removeSpaceMember({ userId: user.id, spaceId });
  }

  async function toggleJoin() {
    if (isCurrentUserMember) {
      return leave();
    }

    return join();
  }

  async function editNameWithModal() {
    const newSpaceName = await openUIPrompt({
      title: "Change space name",
      placeholder: "e.g. Design team, Marketing department, iOS developers...",
      inputIcon: <IconSelection />,
      submitLabel: "Change name",
      validateInput: createLengthValidator("Space name", 3),
      initialValue: space.name,
    });

    if (!newSpaceName?.trim()) return;

    if (newSpaceName === space.name) return;

    await edit({ spaceId: space?.id, input: { name: newSpaceName } });
  }

  async function remove() {
    const didConfirm = await openConfirmPrompt({
      title: `Remove space`,
      description: (
        <>
          Are you sure you want to remove space <strong>{space.name}</strong>
        </>
      ),
      confirmLabel: `Remove`,
    });

    if (!didConfirm) return;

    routes.spaces.push({});

    await deleteSpace({ spaceId: space.id });
  }

  return {
    edit,
    join,
    leave,
    toggleJoin,
    isCurrentUserMember,
    editNameWithModal,
    remove,
  };
}
