import { useState } from "react";
import { useDebounce } from "react-use";
import styled from "styled-components";
import { useFullTextSearch } from "~frontend/gql/search";
import { SearchOutline } from "~ui/icons";
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
      <UISearchBarWrapper>
        <SearchOutline />
        <SearchInput
          placeholder="Search for messages, transcriptions, rooms, and topics"
          value={value}
          onChange={({ currentTarget }) => setValue(currentTarget.value)}
        />
      </UISearchBarWrapper>
      {searchTerm && <SearchResults searchTerm={searchTerm} results={searchResults?.results || []} />}
    </div>
  );
};

export const SearchBar = styled(PureSearchBar)`
  position: relative;

  ${SearchResults} {
    position: absolute;
    /* for explicity: 2.5rem is the height of the search bar wrapper */
    top: calc(2.5rem + 0.4rem);
    width: 100%;
  }
`;

const UISearchBarWrapper = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 2.5rem;
  padding: 0.8rem 1rem;
  background-color: #fff;
  border-radius: 5rem;

  svg {
    fill: #232b35;
  }
`;

const SearchInput = styled.input`
  display: inline-block;
  width: 100%;
  outline: none;
  margin-left: 1rem;
  padding: 0;
  color: #232b35;
`;
