import styled from "styled-components";
import { borderRadius } from "~ui/baseStyles";

interface Props {
  className?: string;
  isParentRoomOpen: boolean;
}

export const TopicClosureBanner = styled(function TopicClosureBanner({ className, isParentRoomOpen }: Props) {
  return (
    <UIBanner className={className}>
      <UIClosingInfo>
        {isParentRoomOpen && (
          <>
            <UIStrongText>Note:</UIStrongText> If you would like to add something to this Topic, please reopen it to
            continue all discussions here.
          </>
        )}

        {!isParentRoomOpen && (
          <>
            <UIStrongText>Note:</UIStrongText> If you would like to reopen this Topic, please reopen the room before.
          </>
        )}
      </UIClosingInfo>
    </UIBanner>
  );
})``;

const UIBanner = styled.div<{}>`
  padding: 16px;
  max-width: 600px;

  ${borderRadius.card};
  background-color: transparent;
  border: 1px solid hsla(300, 2%, 92%, 1);
`;

const UIClosingInfo = styled.div<{}>`
  font-weight: 400;
  line-height: 1.5;
`;

const UIStrongText = styled.span<{}>`
  font-weight: 500;
`;
