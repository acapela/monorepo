import * as React from "react";

function SvgAlertCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 15a1 1 0 111-1 1 1 0 01-1 1zm1-4a1 1 0 01-2 0V8a1 1 0 012 0z"
          data-name="alert-circle"
        />
      </g>
    </svg>
  );
}

export default SvgAlertCircle;
