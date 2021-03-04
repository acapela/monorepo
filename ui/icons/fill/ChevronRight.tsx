import * as React from "react";

function SvgChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M10.5 17a1 1 0 01-.71-.29 1 1 0 010-1.42L13.1 12 9.92 8.69a1 1 0 010-1.41 1 1 0 011.42 0l3.86 4a1 1 0 010 1.4l-4 4a1 1 0 01-.7.32z"
          data-name="chevron-right"
        />
      </g>
    </svg>
  );
}

export default SvgChevronRight;
