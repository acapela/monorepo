import * as React from "react";

function SvgPinOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="pin">
          <path d="M12 2a8 8 0 00-8 7.92c0 5.48 7.05 11.58 7.35 11.84a1 1 0 001.3 0C13 21.5 20 15.4 20 9.92A8 8 0 0012 2zm0 17.65c-1.67-1.59-6-6-6-9.73a6 6 0 0112 0c0 3.7-4.33 8.14-6 9.73z" />
          <path d="M12 6a3.5 3.5 0 103.5 3.5A3.5 3.5 0 0012 6zm0 5a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0112 11z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgPinOutline;
