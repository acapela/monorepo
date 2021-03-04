import * as React from "react";

function SvgFilm(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M18.26 3H5.74A2.74 2.74 0 003 5.74v12.52A2.74 2.74 0 005.74 21h12.52A2.74 2.74 0 0021 18.26V5.74A2.74 2.74 0 0018.26 3zM7 11H5V9h2zm-2 2h2v2H5zm14-2h-2V9h2zm-2 2h2v2h-2zm2-7.26V7h-2V5h1.26a.74.74 0 01.74.74zM5.74 5H7v2H5V5.74A.74.74 0 015.74 5zM5 18.26V17h2v2H5.74a.74.74 0 01-.74-.74zm14 0a.74.74 0 01-.74.74H17v-2h2z"
          data-name="film"
        />
      </g>
    </svg>
  );
}

export default SvgFilm;
