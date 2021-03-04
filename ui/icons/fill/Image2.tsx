import * as React from "react";

function SvgImage2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M18 3H6a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3zM8 7a1.5 1.5 0 11-1.5 1.5A1.5 1.5 0 018 7zm11 10.83A1.09 1.09 0 0118 19H6l7.57-6.82a.69.69 0 01.93 0l4.5 4.48z"
          data-name="image-2"
        />
      </g>
    </svg>
  );
}

export default SvgImage2;
