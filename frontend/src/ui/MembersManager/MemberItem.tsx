import styled from "styled-components";
import { UserBasicInfo } from "~frontend/ui/users/UserBasicInfo";
import { UserBasicInfoFragment } from "~gql";
import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { IconCross } from "~ui/icons";

interface Props {
  user: UserBasicInfoFragment;
  onRemove: () => void;
}

export const MemberItem = ({ user, onRemove }: Props) => {
  return (
    <UIHolder>
      <UserBasicInfo user={user} />
      <CircleIconButton onClick={onRemove} icon={<IconCross />} />
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 8px;
`;
