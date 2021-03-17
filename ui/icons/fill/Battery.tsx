import * as React from "react";

function SvgBattery(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="battery">
          <path d="M15.83 6H4.17A2.31 2.31 0 002 8.43v7.14A2.31 2.31 0 004.17 18h11.66A2.31 2.31 0 0018 15.57V8.43A2.31 2.31 0 0015.83 6zM21 9a1 1 0 00-1 1v4a1 1 0 002 0v-4a1 1 0 00-1-1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgBattery;
