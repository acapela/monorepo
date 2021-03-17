import * as React from "react";

function SvgMinusSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M18 3H6a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3zm-3 10H9a1 1 0 010-2h6a1 1 0 010 2z"
          data-name="minus-square"
        />
      </g>
    </svg>
  );
}

export default SvgMinusSquare;
