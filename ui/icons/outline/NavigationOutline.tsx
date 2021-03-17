import * as React from "react";

function SvgNavigationOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M20 20a.94.94 0 01-.55-.17L12 14.9l-7.45 4.93a1 1 0 01-1.44-1.28l8-16a1 1 0 011.78 0l8 16a1 1 0 01-.23 1.2A1 1 0 0120 20zm-8-7.3a1 1 0 01.55.17l4.88 3.23L12 5.24 6.57 16.1l4.88-3.23a1 1 0 01.55-.17z"
          data-name="navigation"
        />
      </g>
    </svg>
  );
}

export default SvgNavigationOutline;
