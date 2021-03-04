import * as React from "react";

function SvgSpeakerOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="speaker">
          <path d="M12 11a3 3 0 10-3-3 3 3 0 003 3zm0-4a1 1 0 11-1 1 1 1 0 011-1zM12 12a3.5 3.5 0 103.5 3.5A3.5 3.5 0 0012 12zm0 5a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0112 17z" />
          <path d="M17 2H7a3 3 0 00-3 3v14a3 3 0 003 3h10a3 3 0 003-3V5a3 3 0 00-3-3zm1 17a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1h10a1 1 0 011 1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgSpeakerOutline;
