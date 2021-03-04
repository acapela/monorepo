import * as React from "react";

function SvgCheckmarkSquareOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="checkmark-square">
          <path d="M20 11.83a1 1 0 00-1 1v5.57a.6.6 0 01-.6.6H5.6a.6.6 0 01-.6-.6V5.6a.6.6 0 01.6-.6h9.57a1 1 0 100-2H5.6A2.61 2.61 0 003 5.6v12.8A2.61 2.61 0 005.6 21h12.8a2.61 2.61 0 002.6-2.6v-5.57a1 1 0 00-1-1z" />
          <path d="M10.72 11a1 1 0 00-1.44 1.38l2.22 2.33a1 1 0 00.72.31 1 1 0 00.72-.3l6.78-7a1 1 0 10-1.44-1.4l-6.05 6.26z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgCheckmarkSquareOutline;
