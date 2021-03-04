import * as React from "react";

function SvgQuestionMarkCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 16a1 1 0 111-1 1 1 0 01-1 1zm1-5.16V14a1 1 0 01-2 0v-2a1 1 0 011-1 1.5 1.5 0 10-1.5-1.5 1 1 0 01-2 0 3.5 3.5 0 114.5 3.34z"
          data-name="menu-arrow-circle"
        />
      </g>
    </svg>
  );
}

export default SvgQuestionMarkCircle;
