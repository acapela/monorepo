import * as React from "react";

function SvgTvOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M18 6h-3.59l2.3-2.29a1 1 0 10-1.42-1.42L12 5.59l-3.29-3.3a1 1 0 10-1.42 1.42L9.59 6H6a3 3 0 00-3 3v10a3 3 0 003 3h12a3 3 0 003-3V9a3 3 0 00-3-3zm1 13a1 1 0 01-1 1H6a1 1 0 01-1-1V9a1 1 0 011-1h12a1 1 0 011 1z"
          data-name="tv"
        />
      </g>
    </svg>
  );
}

export default SvgTvOutline;
