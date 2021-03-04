import * as React from "react";

function SvgSmartphoneOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="smartphone">
          <path d="M17 2H7a3 3 0 00-3 3v14a3 3 0 003 3h10a3 3 0 003-3V5a3 3 0 00-3-3zm1 17a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1h10a1 1 0 011 1z" />
          <circle cx={12} cy={16.5} r={1.5} />
          <path d="M14.5 6h-5a1 1 0 000 2h5a1 1 0 000-2z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgSmartphoneOutline;
