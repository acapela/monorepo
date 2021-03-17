import * as React from "react";

function SvgSaveOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M20.12 8.71l-4.83-4.83A3 3 0 0013.17 3H6a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3v-7.17a3 3 0 00-.88-2.12zM10 19v-2h4v2zm9-1a1 1 0 01-1 1h-2v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3H6a1 1 0 01-1-1V6a1 1 0 011-1h2v5a1 1 0 001 1h4a1 1 0 000-2h-3V5h3.17a1.05 1.05 0 01.71.29l4.83 4.83a1 1 0 01.29.71z"
          data-name="save"
        />
      </g>
    </svg>
  );
}

export default SvgSaveOutline;
