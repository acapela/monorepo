import * as React from "react";

function SvgRefreshOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M20.3 13.43a1 1 0 00-1.25.65A7.14 7.14 0 0112.18 19 7.1 7.1 0 015 12a7.1 7.1 0 017.18-7 7.26 7.26 0 014.65 1.67l-2.17-.36a1 1 0 00-1.15.83 1 1 0 00.83 1.15l4.24.7h.17a1 1 0 00.34-.06.33.33 0 00.1-.06.78.78 0 00.2-.11l.09-.11c0-.05.09-.09.13-.15s0-.1.05-.14a1.34 1.34 0 00.07-.18l.75-4a1 1 0 00-2-.38l-.27 1.45A9.21 9.21 0 0012.18 3 9.1 9.1 0 003 12a9.1 9.1 0 009.18 9A9.12 9.12 0 0021 14.68a1 1 0 00-.7-1.25z"
          data-name="refresh"
        />
      </g>
    </svg>
  );
}

export default SvgRefreshOutline;
