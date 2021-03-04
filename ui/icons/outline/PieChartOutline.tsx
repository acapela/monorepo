import * as React from "react";

function SvgPieChartOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="pie-chart">
          <path d="M13 2a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1 9 9 0 00-9-9zm1 8V4.07A7 7 0 0119.93 10z" />
          <path d="M20.82 14.06a1 1 0 00-1.28.61A8 8 0 119.33 4.46a1 1 0 00-.66-1.89 10 10 0 1012.76 12.76 1 1 0 00-.61-1.27z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgPieChartOutline;
