import * as React from "react";

function SvgFacebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M17 3.5a.5.5 0 00-.5-.5H14a4.77 4.77 0 00-5 4.5v2.7H6.5a.5.5 0 00-.5.5v2.6a.5.5 0 00.5.5H9v6.7a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-6.7h2.62a.5.5 0 00.49-.37l.72-2.6a.5.5 0 00-.48-.63H13V7.5a1 1 0 011-.9h2.5a.5.5 0 00.5-.5z"
          data-name="facebook"
        />
      </g>
    </svg>
  );
}

export default SvgFacebook;
