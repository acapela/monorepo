import * as React from "react";

function SvgUndo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M20.22 21a1 1 0 01-1-.76 8.91 8.91 0 00-7.8-6.69v1.12a1.78 1.78 0 01-1.09 1.64A2 2 0 018.18 16l-5.06-4.41a1.76 1.76 0 010-2.68l5.06-4.42a2 2 0 012.18-.3 1.78 1.78 0 011.09 1.64V7A10.89 10.89 0 0121.5 17.75a10.29 10.29 0 01-.31 2.49 1 1 0 01-1 .76z"
          data-name="undo"
        />
      </g>
    </svg>
  );
}

export default SvgUndo;
