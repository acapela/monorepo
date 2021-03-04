import * as React from "react";

function SvgCar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M21.6 11.22L17 7.52V5a1.91 1.91 0 00-1.81-2H3.79A1.91 1.91 0 002 5v10a2 2 0 001.2 1.88 3 3 0 105.6.12h6.36a3 3 0 105.64 0h.2a1 1 0 001-1v-4a1 1 0 00-.4-.78zM20 12.48V15h-3v-4.92zM7 18a1 1 0 11-1-1 1 1 0 011 1zm12 0a1 1 0 11-1-1 1 1 0 011 1z"
          data-name="car"
        />
      </g>
    </svg>
  );
}

export default SvgCar;
