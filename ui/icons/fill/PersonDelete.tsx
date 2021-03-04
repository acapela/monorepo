import * as React from "react";

function SvgPersonDelete(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="person-delete">
          <path d="M20.47 7.5l.73-.73a1 1 0 00-1.47-1.47L19 6l-.73-.73a1 1 0 00-1.47 1.5l.73.73-.73.73a1 1 0 001.47 1.47L19 9l.73.73a1 1 0 001.47-1.5zM10 11a4 4 0 10-4-4 4 4 0 004 4zM16 21a1 1 0 001-1 7 7 0 00-14 0 1 1 0 001 1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgPersonDelete;
