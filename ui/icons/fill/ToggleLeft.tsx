import * as React from "react";

function SvgToggleLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="toggle-left">
          <path d="M15 5H9a7 7 0 000 14h6a7 7 0 000-14zM9 15a3 3 0 113-3 3 3 0 01-3 3z" />
          <path d="M9 11a1 1 0 100 2 1 1 0 000-2z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgToggleLeft;
