import * as React from "react";

function SvgHeartOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 21a1 1 0 01-.71-.29l-7.77-7.78a5.26 5.26 0 010-7.4 5.24 5.24 0 017.4 0L12 6.61l1.08-1.08a5.24 5.24 0 017.4 0 5.26 5.26 0 010 7.4l-7.77 7.78A1 1 0 0112 21zM7.22 6a3.2 3.2 0 00-2.28.94 3.24 3.24 0 000 4.57L12 18.58l7.06-7.07a3.24 3.24 0 000-4.57 3.32 3.32 0 00-4.56 0l-1.79 1.8a1 1 0 01-1.42 0L9.5 6.94A3.2 3.2 0 007.22 6z"
          data-name="heart"
        />
      </g>
    </svg>
  );
}

export default SvgHeartOutline;
