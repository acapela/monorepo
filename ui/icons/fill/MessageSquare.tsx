import * as React from "react";

function SvgMessageSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19 3H5a3 3 0 00-3 3v15a1 1 0 00.51.87A1 1 0 003 22a1 1 0 00.51-.14L8 19.14a1 1 0 01.55-.14H19a3 3 0 003-3V6a3 3 0 00-3-3zM8 12a1 1 0 111-1 1 1 0 01-1 1zm4 0a1 1 0 111-1 1 1 0 01-1 1zm4 0a1 1 0 111-1 1 1 0 01-1 1z"
          data-name="message-square"
        />
      </g>
    </svg>
  );
}

export default SvgMessageSquare;
