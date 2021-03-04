import * as React from "react";

function SvgPhoneOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M17.4 22A15.42 15.42 0 012 6.6 4.6 4.6 0 016.6 2a3.94 3.94 0 01.77.07 3.79 3.79 0 01.72.18 1 1 0 01.65.75l1.37 6a1 1 0 01-.26.92c-.13.14-.14.15-1.37.79a9.91 9.91 0 004.87 4.89c.65-1.24.66-1.25.8-1.38a1 1 0 01.92-.26l6 1.37a1 1 0 01.72.65 4.34 4.34 0 01.19.73 4.77 4.77 0 01.06.76A4.6 4.6 0 0117.4 22zM6.6 4A2.61 2.61 0 004 6.6 13.41 13.41 0 0017.4 20a2.61 2.61 0 002.6-2.6v-.33L15.36 16l-.29.55c-.45.87-.78 1.5-1.62 1.16a11.85 11.85 0 01-7.18-7.21c-.36-.78.32-1.14 1.18-1.59L8 8.64 6.93 4z"
          data-name="phone"
        />
      </g>
    </svg>
  );
}

export default SvgPhoneOutline;
