import * as React from "react";

function SvgArrowheadUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="arrowhead-up">
          <path d="M6.63 11.61L12 7.29l5.37 4.48A1 1 0 0018 12a1 1 0 00.77-.36 1 1 0 00-.13-1.41l-6-5a1 1 0 00-1.27 0l-6 4.83a1 1 0 00-.15 1.41 1 1 0 001.41.14z" />
          <path d="M12.64 12.23a1 1 0 00-1.27 0l-6 4.83a1 1 0 00-.15 1.41 1 1 0 001.41.15L12 14.29l5.37 4.48A1 1 0 0018 19a1 1 0 00.77-.36 1 1 0 00-.13-1.41z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgArrowheadUp;
