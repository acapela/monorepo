import { ReactNode } from "react";
import styled from "styled-components";
import { Button } from "~ui/buttons/Button";
import { IconPlusSquare } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";

interface Props {
  input: ReactNode;
  isValid: boolean;
  onSubmit: () => void;
}

export const AddMemberInlineForm = ({ input, isValid, onSubmit }: Props) => {
  useShortcut("Enter", onSubmit, { isEnabled: isValid });

  return (
    <UIHolder>
      {input}
      <Button iconPosition="start" icon={<IconPlusSquare />} onClick={onSubmit} isDisabled={!isValid}>
        Add Member
      </Button>
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
`;
