import styled from "styled-components";
import { ItemTitle } from "~ui/typo";
import { SpaceBasicInfoFragment } from "~frontend/gql";
import { useRouter } from "next/router";

interface Props {
  space: SpaceBasicInfoFragment;
}

export function SpaceCard({ space }: Props) {
  const router = useRouter();
  return (
    <UIHolder
      onClick={() => {
        router.push(`space/${space.id}`);
      }}
    >
      <UIImage></UIImage>
      <UIInfo>
        <ItemTitle>{space.name}</ItemTitle>
      </UIInfo>
    </UIHolder>
  );
}

const UIHolder = styled.div``;

const UIImage = styled.div`
  padding-bottom: 58%;
  background-color: #fccedd;
  border-radius: 1rem;
  margin-bottom: 1rem;
`;
const UIInfo = styled.div`
  text-align: center;
`;
