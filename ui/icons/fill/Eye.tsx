import * as React from "react";

function SvgEye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="eye">
          <circle cx={12} cy={12} r={1.5} />
          <path d="M21.87 11.5c-.64-1.11-4.16-6.68-10.14-6.5-5.53.14-8.73 5-9.6 6.5a1 1 0 000 1c.63 1.09 4 6.5 9.89 6.5h.25c5.53-.14 8.74-5 9.6-6.5a1 1 0 000-1zm-9.87 4a3.5 3.5 0 113.5-3.5 3.5 3.5 0 01-3.5 3.5z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgEye;
