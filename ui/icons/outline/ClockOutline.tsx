import * as React from "react";

function SvgClockOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="clock">
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z" />
          <path d="M16 11h-3V8a1 1 0 00-2 0v4a1 1 0 001 1h4a1 1 0 000-2z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgClockOutline;
