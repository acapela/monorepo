import * as React from "react";

function SvgHashOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M20 14h-4.3l.73-4H20a1 1 0 000-2h-3.21l.69-3.81A1 1 0 0016.64 3a1 1 0 00-1.22.82L14.67 8h-3.88l.69-3.81A1 1 0 0010.64 3a1 1 0 00-1.22.82L8.67 8H4a1 1 0 000 2h4.3l-.73 4H4a1 1 0 000 2h3.21l-.69 3.81A1 1 0 007.36 21a1 1 0 001.22-.82L9.33 16h3.88l-.69 3.81a1 1 0 00.84 1.19 1 1 0 001.22-.82l.75-4.18H20a1 1 0 000-2zM9.7 14l.73-4h3.87l-.73 4z"
          data-name="hash"
        />
      </g>
    </svg>
  );
}

export default SvgHashOutline;
