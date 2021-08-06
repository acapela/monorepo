import { useState } from "react";
import { useDebounce } from "react-use";
import styled from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import { useFullTextSearchQuery } from "~frontend/gql/search";
import { SearchInput } from "~ui/forms/SearchInput";
import { SearchResults } from "./SearchResults";
import { WHITE } from "~ui/theme/colors/base";
import { namedForwardRef } from "~shared/react/namedForwardRef";

interface Props {
  className?: string;
}

const DEBOUNCE_DELAY_MS = 400;

const PureSearchBar = namedForwardRef<HTMLInputElement, Props>(({ className }, ref) => {
  const [value, setValue] = useState("");
  const [term, setTerm] = useState(value);
  const [results] = useFullTextSearchQuery({ term: `%${term}%` });

  useDebounce(
    () => {
      setTerm(value);
    },
    DEBOUNCE_DELAY_MS,
    [value]
  );

  return (
    <div className={className} onClick={(event) => event.stopPropagation()}>
      <SearchInput autoFocus ref={ref} value={value} onChangeText={(text) => setValue(text)} />
      {term && results && <SearchResults {...{ term, results }} />}
    </div>
  );
});

export const SearchBar = styled(PureSearchBar)<{}>`
  position: relative;
  background: ${WHITE};

  ${borderRadius.input}

  ${SearchInput} > input {
    ${borderRadius.input}
  }

  ${SearchResults} {
    position: absolute;
    /* for explicity: 40px is the height of the search bar wrapper */
    top: calc(40px + 16px);
    width: 100%;
  }
`;
