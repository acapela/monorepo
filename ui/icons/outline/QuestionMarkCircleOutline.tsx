import * as React from "react";

function SvgQuestionMarkCircleOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="menu-arrow-circle">
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z" />
          <path d="M12 6a3.5 3.5 0 00-3.5 3.5 1 1 0 002 0A1.5 1.5 0 1112 11a1 1 0 00-1 1v2a1 1 0 002 0v-1.16A3.49 3.49 0 0012 6z" />
          <circle cx={12} cy={17} r={1} />
        </g>
      </g>
    </svg>
  );
}

export default SvgQuestionMarkCircleOutline;
