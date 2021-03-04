import * as React from "react";

function SvgCamera(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="camera">
          <circle cx={12} cy={14} r={1.5} />
          <path d="M19 7h-3V5.5A2.5 2.5 0 0013.5 3h-3A2.5 2.5 0 008 5.5V7H5a3 3 0 00-3 3v8a3 3 0 003 3h14a3 3 0 003-3v-8a3 3 0 00-3-3zm-9-1.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V7h-4zm2 12a3.5 3.5 0 113.5-3.5 3.5 3.5 0 01-3.5 3.5z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgCamera;
