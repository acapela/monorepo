import * as React from "react";

function SvgVolumeMute(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M17 21a1.06 1.06 0 01-.57-.17L10 16.43H5a1 1 0 01-1-1V8.57a1 1 0 011-1h5l6.41-4.4A1 1 0 0118 4v16a1 1 0 01-1 1z"
          data-name="volume-mute"
        />
      </g>
    </svg>
  );
}

export default SvgVolumeMute;
