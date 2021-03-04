import * as React from "react";

function SvgFileOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19.74 8.33l-5.44-6a1 1 0 00-.74-.33h-7A2.53 2.53 0 004 4.5v15A2.53 2.53 0 006.56 22h10.88A2.53 2.53 0 0020 19.5V9a1 1 0 00-.26-.67zM17.65 9h-3.94a.79.79 0 01-.71-.85V4h.11zm-.21 11H6.56a.53.53 0 01-.56-.5v-15a.53.53 0 01.56-.5H11v4.15A2.79 2.79 0 0013.71 11H18v8.5a.53.53 0 01-.56.5z"
          data-name="file"
        />
      </g>
    </svg>
  );
}

export default SvgFileOutline;
