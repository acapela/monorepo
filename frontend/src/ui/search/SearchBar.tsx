import { useState } from "react";
import { useDebounce } from "react-use";
import styled from "styled-components";
import { useFullTextSearch } from "~frontend/gql/search";
import { SearchInput } from "~ui/forms/SearchInput";
import { SearchResults } from "./SearchResults";

interface Props {
  className?: string;
}

const DEBOUNCE_DELAY_MS = 400;

const PureSearchBar = ({ className }: Props) => {
  const [value, setValue] = useState("");
  const [searchTerm, setSearchTerm] = useState(value);
  const [searchResults] = useFullTextSearch({ term: searchTerm });

  useDebounce(
    () => {
      setSearchTerm(value);
    },
    DEBOUNCE_DELAY_MS,
    [value]
  );

  return (
    <div className={className}>
      <SearchInput
        placeholder="Search for messages, transcriptions, rooms, and topics"
        value={value}
        onChange={({ currentTarget }) => setValue(currentTarget.value)}
      />
      {searchTerm && <SearchResults searchTerm={searchTerm} results={searchResults?.results || []} />}
    </div>
  );
};

export const SearchBar = styled(PureSearchBar)`
  position: relative;

  ${SearchInput} > input {
    border-radius: 5rem;
  }

  ${SearchResults} {
    position: absolute;
    /* for explicity: 2.5rem is the height of the search bar wrapper */
    top: calc(2.5rem + 0.4rem);
    width: 100%;
  }
`;
