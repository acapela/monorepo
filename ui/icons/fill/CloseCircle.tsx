import * as React from "react";

function SvgCloseCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm2.71 11.29a1 1 0 010 1.42 1 1 0 01-1.42 0L12 13.41l-1.29 1.3a1 1 0 01-1.42 0 1 1 0 010-1.42l1.3-1.29-1.3-1.29a1 1 0 011.42-1.42l1.29 1.3 1.29-1.3a1 1 0 011.42 1.42L13.41 12z"
          data-name="close-circle"
        />
      </g>
    </svg>
  );
}

export default SvgCloseCircle;
