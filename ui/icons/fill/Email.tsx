import * as React from "react";

function SvgEmail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm0 2l-6.5 4.47a1 1 0 01-1 0L5 6z"
          data-name="email"
        />
      </g>
    </svg>
  );
}

export default SvgEmail;
