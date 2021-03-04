import * as React from "react";

function SvgPeopleOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="people">
          <path d="M9 11a4 4 0 10-4-4 4 4 0 004 4zm0-6a2 2 0 11-2 2 2 2 0 012-2zM17 13a3 3 0 10-3-3 3 3 0 003 3zm0-4a1 1 0 11-1 1 1 1 0 011-1zM17 14a5 5 0 00-3.06 1.05A7 7 0 002 20a1 1 0 002 0 5 5 0 0110 0 1 1 0 002 0 6.9 6.9 0 00-.86-3.35A3 3 0 0120 19a1 1 0 002 0 5 5 0 00-5-5z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgPeopleOutline;
