import * as React from "react";

function SvgCalendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M18 4h-1V3a1 1 0 00-2 0v1H9V3a1 1 0 00-2 0v1H6a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V7a3 3 0 00-3-3zM8 17a1 1 0 111-1 1 1 0 01-1 1zm8 0h-4a1 1 0 010-2h4a1 1 0 010 2zm3-6H5V7a1 1 0 011-1h1v1a1 1 0 002 0V6h6v1a1 1 0 002 0V6h1a1 1 0 011 1z"
          data-name="calendar"
        />
      </g>
    </svg>
  );
}

export default SvgCalendar;
