import * as React from "react";

function SvgMonitor(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="monitor">
          <path d="M19 3H5a3 3 0 00-3 3v5h20V6a3 3 0 00-3-3zM2 14a3 3 0 003 3h6v2H7a1 1 0 000 2h10a1 1 0 000-2h-4v-2h6a3 3 0 003-3v-1H2z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgMonitor;
