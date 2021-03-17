import * as React from "react";

function SvgPricetags(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M21.47 11.58l-6.42-6.41a1 1 0 00-.61-.29L5.09 4a1 1 0 00-.8.29 1 1 0 00-.29.8l.88 9.35a1 1 0 00.29.61l6.41 6.42a1.84 1.84 0 001.29.53 1.82 1.82 0 001.28-.53l7.32-7.32a1.82 1.82 0 000-2.57zm-9.91 0a1.5 1.5 0 110-2.12 1.49 1.49 0 010 2.1z"
          data-name="pricetags"
        />
      </g>
    </svg>
  );
}

export default SvgPricetags;
