import * as React from "react";

function SvgCloseSquareOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="close-square">
          <path d="M18 3H6a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3zm1 15a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h12a1 1 0 011 1z" />
          <path d="M14.71 9.29a1 1 0 00-1.42 0L12 10.59l-1.29-1.3a1 1 0 00-1.42 1.42l1.3 1.29-1.3 1.29a1 1 0 000 1.42 1 1 0 001.42 0l1.29-1.3 1.29 1.3a1 1 0 001.42 0 1 1 0 000-1.42L13.41 12l1.3-1.29a1 1 0 000-1.42z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgCloseSquareOutline;
