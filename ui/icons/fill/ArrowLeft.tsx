import * as React from "react";

function SvgArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M13.54 18a2.06 2.06 0 01-1.3-.46l-5.1-4.21a1.7 1.7 0 010-2.66l5.1-4.21a2.1 2.1 0 012.21-.26 1.76 1.76 0 011.05 1.59v8.42a1.76 1.76 0 01-1.05 1.59 2.23 2.23 0 01-.91.2z"
          data-name="arrow-left"
        />
      </g>
    </svg>
  );
}

export default SvgArrowLeft;
