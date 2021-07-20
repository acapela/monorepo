import { useState } from "react";
import { useDebounce } from "react-use";
import styled from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import { useFullTextSearchQuery } from "~frontend/gql/search";
import { SearchInput } from "~ui/forms/SearchInput";
import { SearchResults } from "./SearchResults";
import { forwardRef } from "react";
import { WHITE } from "~ui/colors";

interface Props {
  className?: string;
}

const DEBOUNCE_DELAY_MS = 400;

const PureSearchBar = forwardRef<HTMLInputElement, Props>(({ className }: Props, ref) => {
  const [value, setValue] = useState("");
  const [searchTerm, setSearchTerm] = useState(value);
  const [searchResults = []] = useFullTextSearchQuery({ term: searchTerm });

  useDebounce(
    () => {
      setSearchTerm(value);
    },
    DEBOUNCE_DELAY_MS,
    [value]
  );

  return (
    <div className={className} onClick={(event) => event.stopPropagation()}>
      <SearchInput autoFocus ref={ref} value={value} onChangeText={(text) => setValue(text)} />
      {searchTerm && <SearchResults searchTerm={searchTerm} results={searchResults} />}
    </div>
  );
});

export const SearchBar = styled(PureSearchBar)`
  position: relative;
  background: ${WHITE};

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
