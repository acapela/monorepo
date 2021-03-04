import * as React from "react";

function SvgPlayCircleOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="play-circle">
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z" />
          <path d="M12.34 7.45a1.7 1.7 0 00-1.85-.3 1.6 1.6 0 00-1 1.48v6.74a1.6 1.6 0 001 1.48 1.68 1.68 0 00.69.15 1.74 1.74 0 001.16-.45L16 13.18a1.6 1.6 0 000-2.36zm-.84 7.15V9.4l2.81 2.6z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgPlayCircleOutline;
