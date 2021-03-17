import * as React from "react";

function SvgPaperPlaneOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M21 4a1.31 1.31 0 00-.06-.27v-.09a1 1 0 00-.2-.3 1 1 0 00-.29-.19h-.09a.86.86 0 00-.31-.15H20a1 1 0 00-.3 0l-18 6a1 1 0 000 1.9l8.53 2.84 2.84 8.53a1 1 0 001.9 0l6-18A1 1 0 0021 4zm-4.7 2.29l-5.57 5.57L5.16 10zM14 18.84l-1.86-5.57 5.57-5.57z"
          data-name="paper-plane"
        />
      </g>
    </svg>
  );
}

export default SvgPaperPlaneOutline;
