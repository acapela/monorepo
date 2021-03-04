import * as React from "react";

function SvgArrowUpward(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M5.23 10.64a1 1 0 001.41.13L11 7.14V19a1 1 0 002 0V7.14l4.36 3.63a1 1 0 101.28-1.54l-6-5-.15-.09-.13-.07a1 1 0 00-.72 0l-.13.07-.15.09-6 5a1 1 0 00-.13 1.41z"
          data-name="arrow-upward"
        />
      </g>
    </svg>
  );
}

export default SvgArrowUpward;
