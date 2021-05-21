import styled from "styled-components";
import { Search } from "~ui/icons";
import { TextInput, TextInputProps } from "./TextInput";

export function SearchInput(props: TextInputProps) {
  return (
    <UIHolder>
      <UISearchIcon />
      <Input {...props} />
    </UIHolder>
  );
}

const UIHolder = styled.div`
  position: relative;
`;

const Input = styled(TextInput)`
  padding-left: 2.25rem;
`;

const UISearchIcon = styled(Search)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0.75rem;
`;
