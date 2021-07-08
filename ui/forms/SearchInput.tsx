import styled from "styled-components";
import { IconSearch } from "~ui/icons";
import { TextInput, TextInputProps } from "./TextInput";

interface Props extends TextInputProps {
  className?: string;
}

export const SearchInput = styled(function PureSearchInput({ className, ...rest }: Props) {
  return (
    <div className={className}>
      <Input icon={<IconSearch />} {...rest} />
    </div>
  );
})``;

const Input = styled(TextInput)`
  padding-left: 2.25rem;
`;
