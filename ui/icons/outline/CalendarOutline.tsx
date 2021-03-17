import * as React from "react";

function SvgCalendarOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="calendar">
          <path d="M18 4h-1V3a1 1 0 00-2 0v1H9V3a1 1 0 00-2 0v1H6a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V7a3 3 0 00-3-3zM6 6h1v1a1 1 0 002 0V6h6v1a1 1 0 002 0V6h1a1 1 0 011 1v4H5V7a1 1 0 011-1zm12 14H6a1 1 0 01-1-1v-6h14v6a1 1 0 01-1 1z" />
          <circle cx={8} cy={16} r={1} />
          <path d="M16 15h-4a1 1 0 000 2h4a1 1 0 000-2z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgCalendarOutline;
