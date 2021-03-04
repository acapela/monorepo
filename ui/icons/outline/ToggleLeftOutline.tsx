import * as React from "react";

function SvgToggleLeftOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="toggle-left">
          <path d="M15 5H9a7 7 0 000 14h6a7 7 0 000-14zm0 12H9A5 5 0 019 7h6a5 5 0 010 10z" />
          <path d="M9 9a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgToggleLeftOutline;
