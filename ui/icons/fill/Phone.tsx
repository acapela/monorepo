import * as React from "react";

function SvgPhone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M17.4 22A15.42 15.42 0 012 6.6 4.6 4.6 0 016.6 2a3.94 3.94 0 01.77.07 3.79 3.79 0 01.72.18 1 1 0 01.65.75l1.37 6a1 1 0 01-.26.92c-.13.14-.14.15-1.37.79a9.91 9.91 0 004.87 4.89c.65-1.24.66-1.25.8-1.38a1 1 0 01.92-.26l6 1.37a1 1 0 01.72.65 4.34 4.34 0 01.19.73 4.77 4.77 0 01.06.76A4.6 4.6 0 0117.4 22z"
          data-name="phone"
        />
      </g>
    </svg>
  );
}

export default SvgPhone;
