import * as React from "react";

function SvgVideo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M21 7.15a1.7 1.7 0 00-1.85.3l-2.15 2V8a3 3 0 00-3-3H5a3 3 0 00-3 3v8a3 3 0 003 3h9a3 3 0 003-3v-1.45l2.16 2a1.74 1.74 0 001.16.45 1.68 1.68 0 00.69-.15 1.6 1.6 0 001-1.48V8.63A1.6 1.6 0 0021 7.15z"
          data-name="video"
        />
      </g>
    </svg>
  );
}

export default SvgVideo;
