import * as React from "react";

function SvgBackspace(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M20.14 4h-9.77a3 3 0 00-2 .78l-.1.11-6 7.48a1 1 0 00.11 1.37l6 5.48a3 3 0 002 .78h9.77A1.84 1.84 0 0022 18.18V5.82A1.84 1.84 0 0020.14 4zm-3.43 9.29a1 1 0 010 1.42 1 1 0 01-1.42 0L14 13.41l-1.29 1.3a1 1 0 01-1.42 0 1 1 0 010-1.42l1.3-1.29-1.3-1.29a1 1 0 011.42-1.42l1.29 1.3 1.29-1.3a1 1 0 011.42 1.42L15.41 12z"
          data-name="backspace"
        />
      </g>
    </svg>
  );
}

export default SvgBackspace;
