import * as React from "react";

function SvgMonitorOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19 3H5a3 3 0 00-3 3v8a3 3 0 003 3h6v2H7a1 1 0 000 2h10a1 1 0 000-2h-4v-2h6a3 3 0 003-3V6a3 3 0 00-3-3zm1 11a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h14a1 1 0 011 1z"
          data-name="monitor"
        />
      </g>
    </svg>
  );
}

export default SvgMonitorOutline;
