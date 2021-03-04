import * as React from "react";

function SvgFlip2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="flip-2">
          <path d="M6.09 19h12l-1.3 1.29a1 1 0 001.42 1.42l3-3a1 1 0 000-1.42l-3-3a1 1 0 00-1.42 0 1 1 0 000 1.42l1.3 1.29h-12a1.56 1.56 0 01-1.59-1.53V13a1 1 0 00-2 0v2.47A3.56 3.56 0 006.09 19zM5.79 9.71a1 1 0 101.42-1.42L5.91 7h12a1.56 1.56 0 011.59 1.53V11a1 1 0 002 0V8.53A3.56 3.56 0 0017.91 5h-12l1.3-1.29a1 1 0 000-1.42 1 1 0 00-1.42 0l-3 3a1 1 0 000 1.42z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgFlip2;
