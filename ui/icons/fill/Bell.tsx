import * as React from "react";

function SvgBell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M20.52 15.21l-1.8-1.81V8.94a6.86 6.86 0 00-5.82-6.88 6.74 6.74 0 00-7.62 6.67v4.67l-1.8 1.81A1.64 1.64 0 004.64 18H8v.34A3.84 3.84 0 0012 22a3.84 3.84 0 004-3.66V18h3.36a1.64 1.64 0 001.16-2.79zM14 18.34A1.88 1.88 0 0112 20a1.88 1.88 0 01-2-1.66V18h4z"
          data-name="bell"
        />
      </g>
    </svg>
  );
}

export default SvgBell;
