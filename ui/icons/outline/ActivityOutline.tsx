import * as React from "react";

function SvgActivityOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M14.33 20h-.21a2 2 0 01-1.76-1.58L9.68 6l-2.76 6.4A1 1 0 016 13H3a1 1 0 010-2h2.34l2.51-5.79a2 2 0 013.79.38L14.32 18l2.76-6.38A1 1 0 0118 11h3a1 1 0 010 2h-2.34l-2.51 5.79A2 2 0 0114.33 20z"
          data-name="activity"
        />
      </g>
    </svg>
  );
}

export default SvgActivityOutline;
