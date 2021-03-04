import * as React from "react";

function SvgStopCircleOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="stop-circle">
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z" />
          <path d="M14.75 8h-5.5A1.25 1.25 0 008 9.25v5.5A1.25 1.25 0 009.25 16h5.5A1.25 1.25 0 0016 14.75v-5.5A1.25 1.25 0 0014.75 8zM14 14h-4v-4h4z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgStopCircleOutline;
