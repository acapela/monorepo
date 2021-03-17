import * as React from "react";

function SvgAt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M13 2a10 10 0 00-5 19.1 10.15 10.15 0 004 .9 10 10 0 006.08-2.06 1 1 0 00.19-1.4 1 1 0 00-1.41-.19A8 8 0 1112.77 4 8.17 8.17 0 0120 12.22v.68a1.71 1.71 0 01-1.78 1.7 1.82 1.82 0 01-1.62-1.88V8.4a1 1 0 00-1-1 1 1 0 00-1 .87 5 5 0 00-3.44-1.36A5.09 5.09 0 1015.31 15a3.6 3.6 0 005.55.61A3.67 3.67 0 0022 12.9v-.68A10.2 10.2 0 0013 2zm-1.82 13.09A3.09 3.09 0 1114.27 12a3.1 3.1 0 01-3.09 3.09z"
          data-name="at"
        />
      </g>
    </svg>
  );
}

export default SvgAt;
