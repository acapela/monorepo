import styled from "styled-components";

import { namedForwardRef } from "~shared/react/namedForwardRef";
import { IconSearch } from "~ui/icons";

import { TextInput, TextInputProps } from "./TextInput";

interface Props extends TextInputProps {
  className?: string;
}

export const SearchInput = styled(
  namedForwardRef<HTMLInputElement, Props>(function PureSearchInput({ className, ...rest }: Props, ref) {
    return (
      <div className={className}>
        <Input ref={ref} icon={<IconSearch />} {...rest} />
      </div>
    );
  })
)``;

const Input = styled(TextInput)<{}>`
  padding-left: 2.25rem;
`;
