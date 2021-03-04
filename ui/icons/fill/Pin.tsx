import * as React from "react";

function SvgPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="pin">
          <circle cx={12} cy={9.5} r={1.5} />
          <path d="M12 2a8 8 0 00-8 7.92c0 5.48 7.05 11.58 7.35 11.84a1 1 0 001.3 0C13 21.5 20 15.4 20 9.92A8 8 0 0012 2zm0 11a3.5 3.5 0 113.5-3.5A3.5 3.5 0 0112 13z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgPin;
