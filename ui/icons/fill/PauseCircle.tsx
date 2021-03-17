import * as React from "react";

function SvgPauseCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm-2 13a1 1 0 01-2 0V9a1 1 0 012 0zm6 0a1 1 0 01-2 0V9a1 1 0 012 0z"
          data-name="pause-circle"
        />
      </g>
    </svg>
  );
}

export default SvgPauseCircle;
