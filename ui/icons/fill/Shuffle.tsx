import * as React from "react";

function SvgShuffle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="shuffle">
          <path d="M18 9.31a1 1 0 001 1 1 1 0 001-1V5a1 1 0 00-1-1h-4.3a1 1 0 00-1 1 1 1 0 001 1h1.89L12 10.59 6.16 4.76a1 1 0 00-1.41 1.41L10.58 12l-6.29 6.29a1 1 0 000 1.42 1 1 0 001.42 0L18 7.42z" />
          <path d="M19 13.68a1 1 0 00-1 1v1.91l-2.78-2.79a1 1 0 00-1.42 1.42L16.57 18h-1.88a1 1 0 000 2H19a1 1 0 001-1.11v-4.21a1 1 0 00-1-1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgShuffle;
