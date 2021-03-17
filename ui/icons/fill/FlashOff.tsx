import * as React from "react";

function SvgFlashOff(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="flash-off">
          <path d="M17.33 14.5l2.5-3.74A1 1 0 0019 9.2h-5.89l.77-7.09a1 1 0 00-.65-1 1 1 0 00-1.17.38L8.94 6.11zM6.67 9.5l-2.5 3.74A1 1 0 005 14.8h5.89l-.77 7.09a1 1 0 00.65 1.05 1 1 0 00.34.06 1 1 0 00.83-.44l3.12-4.67zM20.71 19.29l-16-16a1 1 0 00-1.42 1.42l16 16a1 1 0 001.42 0 1 1 0 000-1.42z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgFlashOff;
