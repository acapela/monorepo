import * as React from "react";

function SvgUmbrella(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 2A10 10 0 002 12a1 1 0 001 1h8v6a3 3 0 006 0 1 1 0 00-2 0 1 1 0 01-2 0v-6h8a1 1 0 001-1A10 10 0 0012 2z"
          data-name="umbrella"
        />
      </g>
    </svg>
  );
}

export default SvgUmbrella;
