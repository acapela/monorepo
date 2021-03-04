import * as React from "react";

function SvgLockOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="lock">
          <path d="M17 8h-1V6.11a4 4 0 10-8 0V8H7a3 3 0 00-3 3v8a3 3 0 003 3h10a3 3 0 003-3v-8a3 3 0 00-3-3zm-7-1.89A2.06 2.06 0 0112 4a2.06 2.06 0 012 2.11V8h-4zM18 19a1 1 0 01-1 1H7a1 1 0 01-1-1v-8a1 1 0 011-1h10a1 1 0 011 1z" />
          <path d="M12 12a3 3 0 103 3 3 3 0 00-3-3zm0 4a1 1 0 111-1 1 1 0 01-1 1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgLockOutline;
