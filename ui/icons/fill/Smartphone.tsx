import * as React from "react";

function SvgSmartphone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M17 2H7a3 3 0 00-3 3v14a3 3 0 003 3h10a3 3 0 003-3V5a3 3 0 00-3-3zm-5 16a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0112 18zm2.5-10h-5a1 1 0 010-2h5a1 1 0 010 2z"
          data-name="smartphone"
        />
      </g>
    </svg>
  );
}

export default SvgSmartphone;
