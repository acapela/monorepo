import * as React from "react";

function SvgGoogle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M17.5 14a5.51 5.51 0 01-4.5 3.93 6.15 6.15 0 01-7-5.45A6 6 0 0112 6a6.12 6.12 0 012.27.44.5.5 0 00.64-.21l1.44-2.65a.52.52 0 00-.23-.7A10 10 0 002 12.29 10.12 10.12 0 0011.57 22 10 10 0 0022 12.52v-2a.51.51 0 00-.5-.5h-9a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h5"
          data-name="google"
        />
      </g>
    </svg>
  );
}

export default SvgGoogle;
