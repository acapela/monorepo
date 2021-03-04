import * as React from "react";

function SvgLayers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="layers">
          <path d="M3.24 7.29l8.52 4.63a.51.51 0 00.48 0l8.52-4.63a.44.44 0 00-.05-.81L12.19 3a.5.5 0 00-.38 0L3.29 6.48a.44.44 0 00-.05.81z" />
          <path d="M20.71 10.66l-1.83-.78-6.64 3.61a.51.51 0 01-.48 0L5.12 9.88l-1.83.78a.48.48 0 000 .85l8.52 4.9a.46.46 0 00.48 0l8.52-4.9a.48.48 0 00-.1-.85z" />
          <path d="M20.71 15.1l-1.56-.68-6.91 3.76a.51.51 0 01-.48 0l-6.91-3.76-1.56.68a.49.49 0 000 .87l8.52 5a.51.51 0 00.48 0l8.52-5a.49.49 0 00-.1-.87z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgLayers;
