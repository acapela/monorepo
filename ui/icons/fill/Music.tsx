import * as React from "react";

function SvgMusic(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19 15V4a1 1 0 00-.38-.78 1 1 0 00-.84-.2l-9 2A1 1 0 008 6v8.34a3.49 3.49 0 102 3.18 4.36 4.36 0 000-.52V6.8l7-1.55v7.09a3.49 3.49 0 102 3.17 4.57 4.57 0 000-.51z"
          data-name="music"
        />
      </g>
    </svg>
  );
}

export default SvgMusic;
