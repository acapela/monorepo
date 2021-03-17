import * as React from "react";

function SvgPeople(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="people">
          <path d="M9 11a4 4 0 10-4-4 4 4 0 004 4zM17 13a3 3 0 10-3-3 3 3 0 003 3zM21 20a1 1 0 001-1 5 5 0 00-8.06-3.95A7 7 0 002 20a1 1 0 001 1h12a1 1 0 001-1" />
        </g>
      </g>
    </svg>
  );
}

export default SvgPeople;
