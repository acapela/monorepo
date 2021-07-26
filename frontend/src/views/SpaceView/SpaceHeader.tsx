import styled from "styled-components";
import { SpaceDetailedInfoFragment } from "~gql";
import { EntityKindLabel, HeroItemTitle } from "~ui/theme/functional";

interface Props {
  space: SpaceDetailedInfoFragment;
  className?: string;
}

export const SpaceHeader = styled(function SpaceHeader({ space, className }: Props) {
  return (
    <UIHolder className={className}>
      <EntityKindLabel>SPACE</EntityKindLabel>
      <HeroItemTitle>{space.name}</HeroItemTitle>
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  ${EntityKindLabel} {
    margin-bottom: 8px;
  }
`;
