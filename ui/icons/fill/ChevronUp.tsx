import * as React from "react";

function SvgChevronUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M16 14.5a1 1 0 01-.71-.29L12 10.9l-3.3 3.18a1 1 0 01-1.41 0 1 1 0 010-1.42l4-3.86a1 1 0 011.4 0l4 4a1 1 0 010 1.42 1 1 0 01-.69.28z"
          data-name="chevron-up"
        />
      </g>
    </svg>
  );
}

export default SvgChevronUp;
