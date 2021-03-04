import * as React from "react";

function SvgPauseCircleOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="pause-circle">
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z" />
          <path d="M15 8a1 1 0 00-1 1v6a1 1 0 002 0V9a1 1 0 00-1-1zM9 8a1 1 0 00-1 1v6a1 1 0 002 0V9a1 1 0 00-1-1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgPauseCircleOutline;
