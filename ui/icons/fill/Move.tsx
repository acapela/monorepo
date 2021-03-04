import * as React from "react";

function SvgMove(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M21.71 11.31l-3-3a1 1 0 00-1.42 1.42L18.58 11H13V5.41l1.29 1.3A1 1 0 0015 7a1 1 0 00.71-.29 1 1 0 000-1.42l-3-3A1 1 0 0012 2a1 1 0 00-.7.29l-3 3a1 1 0 001.41 1.42L11 5.42V11H5.41l1.3-1.29a1 1 0 00-1.42-1.42l-3 3A1 1 0 002 12a1 1 0 00.29.71l3 3A1 1 0 006 16a1 1 0 00.71-.29 1 1 0 000-1.42L5.42 13H11v5.59l-1.29-1.3a1 1 0 00-1.42 1.42l3 3A1 1 0 0012 22a1 1 0 00.7-.29l3-3a1 1 0 00-1.42-1.42L13 18.58V13h5.59l-1.3 1.29a1 1 0 000 1.42A1 1 0 0018 16a1 1 0 00.71-.29l3-3A1 1 0 0022 12a1 1 0 00-.29-.69z"
          data-name="move"
        />
      </g>
    </svg>
  );
}

export default SvgMove;
