import * as React from "react";

function SvgPersonAdd(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="person-add">
          <path d="M21 6h-1V5a1 1 0 00-2 0v1h-1a1 1 0 000 2h1v1a1 1 0 002 0V8h1a1 1 0 000-2zM10 11a4 4 0 10-4-4 4 4 0 004 4zM16 21a1 1 0 001-1 7 7 0 00-14 0 1 1 0 001 1" />
        </g>
      </g>
    </svg>
  );
}

export default SvgPersonAdd;
