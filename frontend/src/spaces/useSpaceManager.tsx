import { SpaceBasicInfoFragment } from "~gql";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { IconSelection } from "~ui/icons";
import { routes } from "~frontend/routes";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import {
  useEditSpaceMutation,
  useRemoveSpaceMemberMutation,
  useAddSpaceMemberMutation,
  useIsCurrentUserSpaceMember,
  deleteSpace,
} from "~frontend/gql/spaces";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { openUIPrompt } from "~frontend/utils/prompt";

export function useSpaceManager(space: SpaceBasicInfoFragment) {
  const spaceId = space.id;
  const user = useAssertCurrentUser();
  const isCurrentUserMember = useIsCurrentUserSpaceMember(space);

  const [addSpaceMember] = useAddSpaceMemberMutation();
  const [removeSpaceMember] = useRemoveSpaceMemberMutation();
  const [edit] = useEditSpaceMutation();

  async function join() {
    await addMember(user.id);
  }

  async function leave() {
    await removeMember(user.id);
  }

  async function addMember(userId: string) {
    addSpaceMember({ userId, spaceId });
  }

  async function removeMember(userId: string) {
    removeSpaceMember({ userId, spaceId });
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
    routes.spaces.prefetch({});
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

  const members = space.members.map((member) => member.user);

  return {
    edit,
    join,
    leave,
    toggleJoin,
    isCurrentUserMember,
    editNameWithModal,
    remove,
    addMember,
    removeMember,
    members,
  };
}
