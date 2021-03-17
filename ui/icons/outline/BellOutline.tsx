import * as React from "react";

function SvgBellOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M20.52 15.21l-1.8-1.81V8.94a6.86 6.86 0 00-5.82-6.88 6.74 6.74 0 00-7.62 6.67v4.67l-1.8 1.81A1.64 1.64 0 004.64 18H8v.34A3.84 3.84 0 0012 22a3.84 3.84 0 004-3.66V18h3.36a1.64 1.64 0 001.16-2.79zM14 18.34A1.88 1.88 0 0112 20a1.88 1.88 0 01-2-1.66V18h4zM5.51 16l1.18-1.18a2 2 0 00.59-1.42V8.73A4.73 4.73 0 018.9 5.17 4.67 4.67 0 0112.64 4a4.86 4.86 0 014.08 4.9v4.5a2 2 0 00.58 1.42L18.49 16z"
          data-name="bell"
        />
      </g>
    </svg>
  );
}

export default SvgBellOutline;
