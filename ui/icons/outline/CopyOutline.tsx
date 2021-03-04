import * as React from "react";

function SvgCopyOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="copy">
          <path d="M18 21h-6a3 3 0 01-3-3v-6a3 3 0 013-3h6a3 3 0 013 3v6a3 3 0 01-3 3zm-6-10a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1v-6a1 1 0 00-1-1z" />
          <path d="M9.73 15H5.67A2.68 2.68 0 013 12.33V5.67A2.68 2.68 0 015.67 3h6.66A2.68 2.68 0 0115 5.67V9.4h-2V5.67a.67.67 0 00-.67-.67H5.67a.67.67 0 00-.67.67v6.66a.67.67 0 00.67.67h4.06z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgCopyOutline;
