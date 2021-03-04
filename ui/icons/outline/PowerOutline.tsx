import * as React from "react";

function SvgPowerOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="power">
          <path d="M12 13a1 1 0 001-1V2a1 1 0 00-2 0v10a1 1 0 001 1z" />
          <path d="M16.59 3.11a1 1 0 00-.92 1.78 8 8 0 11-7.34 0 1 1 0 10-.92-1.78 10 10 0 109.18 0z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgPowerOutline;
