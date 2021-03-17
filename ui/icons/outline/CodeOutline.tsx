import * as React from "react";

function SvgCodeOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="code">
          <path d="M8.64 5.23a1 1 0 00-1.41.13l-5 6a1 1 0 000 1.27l4.83 6a1 1 0 00.78.37 1 1 0 00.78-1.63L4.29 12l4.48-5.36a1 1 0 00-.13-1.41zM21.78 11.37l-4.78-6a1 1 0 00-1.41-.15 1 1 0 00-.15 1.41L19.71 12l-4.48 5.37a1 1 0 00.13 1.41A1 1 0 0016 19a1 1 0 00.77-.36l5-6a1 1 0 00.01-1.27z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgCodeOutline;
