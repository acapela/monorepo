import * as React from "react";

function SvgPersonDone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="person-done">
          <path d="M21.66 4.25a1 1 0 00-1.41.09l-1.87 2.15-.63-.71a1 1 0 00-1.5 1.33l1.39 1.56a1 1 0 00.75.33 1 1 0 00.74-.34l2.61-3a1 1 0 00-.08-1.41zM10 11a4 4 0 10-4-4 4 4 0 004 4zM16 21a1 1 0 001-1 7 7 0 00-14 0 1 1 0 001 1" />
        </g>
      </g>
    </svg>
  );
}

export default SvgPersonDone;
