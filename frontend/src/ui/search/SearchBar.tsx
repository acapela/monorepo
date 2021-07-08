import { useState } from "react";
import { useDebounce } from "react-use";
import styled from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import { useFullTextSearchQuery } from "~frontend/gql/search";
import { SearchInput } from "~ui/forms/SearchInput";
import { SearchResults } from "./SearchResults";

interface Props {
  className?: string;
}

const DEBOUNCE_DELAY_MS = 400;

const PureSearchBar = ({ className }: Props) => {
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
    <div className={className}>
      <SearchInput placeholder="Search..." value={value} onChangeText={(text) => setValue(text)} />
      {searchTerm && <SearchResults searchTerm={searchTerm} results={searchResults} />}
    </div>
  );
};

export const SearchBar = styled(PureSearchBar)`
  position: relative;

  ${SearchInput} > input {
    ${borderRadius.input}
  }

  ${SearchResults} {
    position: absolute;
    /* for explicity: 2.5rem is the height of the search bar wrapper */
    top: calc(2.5rem + 0.4rem);
    width: 100%;
  }
`;
