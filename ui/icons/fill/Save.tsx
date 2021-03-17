import * as React from "react";

function SvgSave(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="save">
          <path d="M10 17h4v4h-4z" />
          <path d="M20.12 8.71l-4.83-4.83A3 3 0 0013.17 3H10v6h5a1 1 0 010 2H9a1 1 0 01-1-1V3H6a3 3 0 00-3 3v12a3 3 0 003 3h2v-4a2 2 0 012-2h4a2 2 0 012 2v4h2a3 3 0 003-3v-7.17a3 3 0 00-.88-2.12z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgSave;
