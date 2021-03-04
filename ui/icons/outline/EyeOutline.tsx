import * as React from "react";

function SvgEyeOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="eye">
          <path d="M21.87 11.5c-.64-1.11-4.16-6.68-10.14-6.5-5.53.14-8.73 5-9.6 6.5a1 1 0 000 1c.63 1.09 4 6.5 9.89 6.5h.25c5.53-.14 8.74-5 9.6-6.5a1 1 0 000-1zM12.22 17c-4.31.1-7.12-3.59-8-5 1-1.61 3.61-4.9 7.61-5 4.29-.11 7.11 3.59 8 5-1.03 1.61-3.61 4.9-7.61 5z" />
          <path d="M12 8.5a3.5 3.5 0 103.5 3.5A3.5 3.5 0 0012 8.5zm0 5a1.5 1.5 0 111.5-1.5 1.5 1.5 0 01-1.5 1.5z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgEyeOutline;
