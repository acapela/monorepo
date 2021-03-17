import * as React from "react";

function SvgRecording(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M18 8a4 4 0 00-4 4 3.91 3.91 0 00.56 2H9.44a3.91 3.91 0 00.56-2 4 4 0 10-4 4h12a4 4 0 000-8z"
          data-name="recording"
        />
      </g>
    </svg>
  );
}

export default SvgRecording;
