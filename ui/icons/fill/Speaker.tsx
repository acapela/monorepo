import * as React from "react";

function SvgSpeaker(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="speaker">
          <circle cx={12} cy={15.5} r={1.5} />
          <circle cx={12} cy={8} r={1} />
          <path d="M17 2H7a3 3 0 00-3 3v14a3 3 0 003 3h10a3 3 0 003-3V5a3 3 0 00-3-3zm-5 3a3 3 0 11-3 3 3 3 0 013-3zm0 14a3.5 3.5 0 113.5-3.5A3.5 3.5 0 0112 19z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgSpeaker;
