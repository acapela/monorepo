import * as React from "react";

function SvgCharging(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="charging">
          <path d="M11.28 13H7a1 1 0 01-.86-.5 1 1 0 010-1L9.28 6H4.17A2.31 2.31 0 002 8.43v7.14A2.31 2.31 0 004.17 18h4.25z" />
          <path d="M15.83 6h-4.25l-2.86 5H13a1 1 0 01.86.5 1 1 0 010 1L10.72 18h5.11A2.31 2.31 0 0018 15.57V8.43A2.31 2.31 0 0015.83 6zM21 9a1 1 0 00-1 1v4a1 1 0 002 0v-4a1 1 0 00-1-1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgCharging;
