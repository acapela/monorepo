import * as React from "react";

function SvgBarChartOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="bar-chart">
          <path d="M12 4a1 1 0 00-1 1v15a1 1 0 002 0V5a1 1 0 00-1-1zM19 12a1 1 0 00-1 1v7a1 1 0 002 0v-7a1 1 0 00-1-1zM5 8a1 1 0 00-1 1v11a1 1 0 002 0V9a1 1 0 00-1-1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgBarChartOutline;
