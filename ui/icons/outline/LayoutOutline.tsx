import * as React from "react";

function SvgLayoutOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M18 3H6a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3zM6 5h12a1 1 0 011 1v2H5V6a1 1 0 011-1zM5 18v-8h6v9H6a1 1 0 01-1-1zm13 1h-5v-9h6v8a1 1 0 01-1 1z"
          data-name="layout"
        />
      </g>
    </svg>
  );
}

export default SvgLayoutOutline;
