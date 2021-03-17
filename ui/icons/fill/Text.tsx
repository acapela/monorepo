import * as React from "react";

function SvgText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M20 4H4a1 1 0 00-1 1v3a1 1 0 002 0V6h6v13H9a1 1 0 000 2h6a1 1 0 000-2h-2V6h6v2a1 1 0 002 0V5a1 1 0 00-1-1z"
          data-name="text"
        />
      </g>
    </svg>
  );
}

export default SvgText;
