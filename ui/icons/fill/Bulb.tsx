import * as React from "react";

function SvgBulb(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="bulb">
          <path d="M12 7a5 5 0 00-3 9v4a2 2 0 002 2h2a2 2 0 002-2v-4a5 5 0 00-3-9zM12 6a1 1 0 001-1V3a1 1 0 00-2 0v2a1 1 0 001 1zM21 11h-2a1 1 0 000 2h2a1 1 0 000-2zM5 11H3a1 1 0 000 2h2a1 1 0 000-2zM7.66 6.42L6.22 5a1 1 0 00-1.39 1.47l1.44 1.39a1 1 0 00.73.28 1 1 0 00.72-.31 1 1 0 00-.06-1.41zM19.19 5.05a1 1 0 00-1.41 0l-1.44 1.37a1 1 0 000 1.41 1 1 0 00.72.31 1 1 0 00.69-.28l1.44-1.39a1 1 0 000-1.42z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgBulb;
