import * as React from "react";

function SvgCollapse(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="collapse">
          <path d="M19 9h-2.58l3.29-3.29a1 1 0 10-1.42-1.42L15 7.57V5a1 1 0 00-1-1 1 1 0 00-1 1v5a1 1 0 001 1h5a1 1 0 000-2zM10 13H5a1 1 0 000 2h2.57l-3.28 3.29a1 1 0 000 1.42 1 1 0 001.42 0L9 16.42V19a1 1 0 001 1 1 1 0 001-1v-5a1 1 0 00-1-1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgCollapse;
