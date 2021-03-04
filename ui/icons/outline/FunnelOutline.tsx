import * as React from "react";

function SvgFunnelOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M13.9 22a1 1 0 01-.6-.2l-4-3.05a1 1 0 01-.39-.8v-3.27l-4.8-9.22A1 1 0 015 4h14a1 1 0 01.86.49 1 1 0 010 1l-5 9.21V21a1 1 0 01-.55.9 1 1 0 01-.41.1zm-3-4.54l2 1.53v-4.55A1 1 0 0113 14l4.3-8H6.64l4.13 8a1 1 0 01.11.46z"
          data-name="funnel"
        />
      </g>
    </svg>
  );
}

export default SvgFunnelOutline;
