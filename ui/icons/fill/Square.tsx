import * as React from "react";

function SvgSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M18 21H6a3 3 0 01-3-3V6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3zM6 5a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1z"
          data-name="square"
        />
      </g>
    </svg>
  );
}

export default SvgSquare;
