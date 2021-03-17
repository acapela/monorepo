import * as React from "react";

function SvgSkipBack(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M16.45 6.2a2.1 2.1 0 00-2.21.26l-5.1 4.21-.14.15V7a1 1 0 00-2 0v10a1 1 0 002 0v-3.82l.14.15 5.1 4.21a2.06 2.06 0 001.3.46 2.23 2.23 0 00.91-.2 1.76 1.76 0 001.05-1.59V7.79a1.76 1.76 0 00-1.05-1.59z"
          data-name="skip-back"
        />
      </g>
    </svg>
  );
}

export default SvgSkipBack;
