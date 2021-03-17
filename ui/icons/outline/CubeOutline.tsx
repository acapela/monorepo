import * as React from "react";

function SvgCubeOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M20.66 7.26c0-.07-.1-.14-.15-.21l-.09-.1a2.5 2.5 0 00-.86-.68l-6.4-3a2.7 2.7 0 00-2.26 0l-6.4 3a2.6 2.6 0 00-.86.68L3.52 7a1 1 0 00-.15.2A2.39 2.39 0 003 8.46v7.06a2.49 2.49 0 001.46 2.26l6.4 3a2.7 2.7 0 002.27 0l6.4-3A2.49 2.49 0 0021 15.54V8.46a2.39 2.39 0 00-.34-1.2zm-8.95-2.2a.73.73 0 01.58 0l5.33 2.48L12 10.15 6.38 7.54zM5.3 16a.47.47 0 01-.3-.43V9.1l6 2.79v6.72zm13.39 0L13 18.61v-6.72l6-2.79v6.44a.48.48 0 01-.31.46z"
          data-name="cube"
        />
      </g>
    </svg>
  );
}

export default SvgCubeOutline;
