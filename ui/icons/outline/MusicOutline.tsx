import * as React from "react";

function SvgMusicOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19 15V4a1 1 0 00-.38-.78 1 1 0 00-.84-.2l-9 2A1 1 0 008 6v8.34a3.49 3.49 0 102 3.18 4.36 4.36 0 000-.52V6.8l7-1.55v7.09a3.49 3.49 0 102 3.17 4.57 4.57 0 000-.51zM6.54 19A1.49 1.49 0 118 17.21a1.53 1.53 0 010 .3A1.49 1.49 0 016.54 19zm9-2A1.5 1.5 0 1117 15.21a1.53 1.53 0 010 .3A1.5 1.5 0 0115.51 17z"
          data-name="music"
        />
      </g>
    </svg>
  );
}

export default SvgMusicOutline;
