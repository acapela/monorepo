import * as React from "react";

function SvgLinkOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="link">
          <path d="M8 12a1 1 0 001 1h6a1 1 0 000-2H9a1 1 0 00-1 1z" />
          <path d="M9 16H7.21A4.13 4.13 0 013 12.37 4 4 0 017 8h2a1 1 0 000-2H7.21a6.15 6.15 0 00-6.16 5.21A6 6 0 007 18h2a1 1 0 000-2zM23 11.24A6.16 6.16 0 0016.76 6h-1.51C14.44 6 14 6.45 14 7a1 1 0 001 1h1.79A4.13 4.13 0 0121 11.63 4 4 0 0117 16h-2a1 1 0 000 2h2a6 6 0 006-6.76z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgLinkOutline;
