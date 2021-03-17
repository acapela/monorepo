import * as React from "react";

function SvgOptionsOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="options">
          <path d="M7 14.18V3a1 1 0 00-2 0v11.18a3 3 0 000 5.64V21a1 1 0 002 0v-1.18a3 3 0 000-5.64zM6 18a1 1 0 111-1 1 1 0 01-1 1zM21 13a3 3 0 00-2-2.82V3a1 1 0 00-2 0v7.18a3 3 0 000 5.64V21a1 1 0 002 0v-5.18A3 3 0 0021 13zm-3 1a1 1 0 111-1 1 1 0 01-1 1zM15 5a3 3 0 10-4 2.82V21a1 1 0 002 0V7.82A3 3 0 0015 5zm-3 1a1 1 0 111-1 1 1 0 01-1 1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgOptionsOutline;
