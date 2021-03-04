import * as React from "react";

function SvgCopy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M18 9h-3V5.67A2.68 2.68 0 0012.33 3H5.67A2.68 2.68 0 003 5.67v6.66A2.68 2.68 0 005.67 15H9v3a3 3 0 003 3h6a3 3 0 003-3v-6a3 3 0 00-3-3zm-9 3v1H5.67a.67.67 0 01-.67-.67V5.67A.67.67 0 015.67 5h6.66a.67.67 0 01.67.67V9h-1a3 3 0 00-3 3z"
          data-name="copy"
        />
      </g>
    </svg>
  );
}

export default SvgCopy;
