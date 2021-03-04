import * as React from "react";

function SvgAward(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19 20.75l-2.31-9A5.94 5.94 0 0018 8 6 6 0 006 8a5.94 5.94 0 001.34 3.77L5 20.75a1 1 0 001.48 1.11l5.33-3.13 5.68 3.14A.91.91 0 0018 22a1 1 0 001-1.25zM12 4a4 4 0 11-4 4 4 4 0 014-4z"
          data-name="award"
        />
      </g>
    </svg>
  );
}

export default SvgAward;
