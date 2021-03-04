import * as React from "react";

function SvgBrush(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="brush">
          <path d="M7.12 12.55a4 4 0 00-3.07 3.86v3.11a.47.47 0 00.48.48l3.24-.06a3.78 3.78 0 003.44-2.2 3.65 3.65 0 00-4.09-5.19zM19.26 4.46a2.14 2.14 0 00-2.88.21L10 11.08a.47.47 0 000 .66L12.25 14a.47.47 0 00.66 0l6.49-6.47a2.06 2.06 0 00.6-1.47 2 2 0 00-.74-1.6z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgBrush;
