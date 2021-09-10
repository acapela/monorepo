import { ErrorBoundary } from "@sentry/nextjs";
import { useState } from "react";
import { useDebounce } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useFullTextSearchQuery } from "~frontend/gql/search";
import { namedForwardRef } from "~shared/react/namedForwardRef";
import { borderRadius } from "~ui/baseStyles";
import { SearchInput } from "~ui/forms/SearchInput";
import { WHITE } from "~ui/theme/colors/base";

import { SearchResults } from "./SearchResults";

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
      trackEvent("Used Search Bar", { searchTerm: value });
    },
    DEBOUNCE_DELAY_MS,
    [value]
  );

  return (
    <div className={className} onClick={(event) => event.stopPropagation()}>
      <SearchInput autoFocus ref={ref} value={value} onChangeText={(text) => setValue(text)} />
      {term && results && (
        <ErrorBoundary fallback={<>An error occurred while searching. We are looking into it!</>}>
          <SearchResults {...{ term, results }} />
        </ErrorBoundary>
      )}
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
