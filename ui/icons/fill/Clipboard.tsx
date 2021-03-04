import * as React from "react";

function SvgClipboard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="clipboard">
          <path d="M18 4v3a2 2 0 01-2 2H8a2 2 0 01-2-2V4a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V7a3 3 0 00-3-3z" />
          <rect x={7} y={2} width={10} height={6} rx={1} ry={1} />
        </g>
      </g>
    </svg>
  );
}

export default SvgClipboard;
