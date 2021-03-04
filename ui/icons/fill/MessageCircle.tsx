import * as React from "react";

function SvgMessageCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19.07 4.93a10 10 0 00-16.28 11 1.06 1.06 0 01.09.64L2 20.8a1 1 0 00.27.91A1 1 0 003 22h.2l4.28-.86a1.26 1.26 0 01.64.09 10 10 0 0011-16.28zM8 13a1 1 0 111-1 1 1 0 01-1 1zm4 0a1 1 0 111-1 1 1 0 01-1 1zm4 0a1 1 0 111-1 1 1 0 01-1 1z"
          data-name="message-circle"
        />
      </g>
    </svg>
  );
}

export default SvgMessageCircle;
