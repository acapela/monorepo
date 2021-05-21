import styled from "styled-components";
import { Search } from "~ui/icons";
import { TextInput, TextInputProps } from "./TextInput";

interface Props extends TextInputProps {
  className?: string;
}

export function PureSearchInput({ className, ...rest }: Props) {
  return (
    <div className={className}>
      <UISearchIcon />
      <Input {...rest} />
    </div>
  );
}

export const SearchInput = styled(PureSearchInput)`
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
