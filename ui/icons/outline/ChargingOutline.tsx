import * as React from "react";

function SvgChargingOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="charging">
          <path d="M21 9a1 1 0 00-1 1v4a1 1 0 002 0v-4a1 1 0 00-1-1zM15.83 6h-3.1l-1.14 2h4.23a.5.5 0 01.18.43v7.14a.52.52 0 01-.17.43H13l-1.15 2h4A2.31 2.31 0 0018 15.57V8.43A2.31 2.31 0 0015.83 6zM4 15.57V8.43A.53.53 0 014.17 8H7l1.13-2h-4A2.31 2.31 0 002 8.43v7.14A2.31 2.31 0 004.17 18h3.1l1.14-2H4.18a.5.5 0 01-.18-.43z" />
          <path d="M9 20a1 1 0 01-.87-1.5l3.15-5.5H7a1 1 0 01-.86-.5 1 1 0 010-1l4-7a1 1 0 011.74 1L8.72 11H13a1 1 0 01.86.5 1 1 0 010 1l-4 7A1 1 0 019 20z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgChargingOutline;
