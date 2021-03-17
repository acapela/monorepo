import * as React from "react";

function SvgClipboardOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M18 5V4a2 2 0 00-2-2H8a2 2 0 00-2 2v1a3 3 0 00-3 3v11a3 3 0 003 3h12a3 3 0 003-3V8a3 3 0 00-3-3zM8 4h8v4H8V4zm11 15a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1v1a2 2 0 002 2h8a2 2 0 002-2V7a1 1 0 011 1z"
          data-name="clipboard"
        />
      </g>
    </svg>
  );
}

export default SvgClipboardOutline;
