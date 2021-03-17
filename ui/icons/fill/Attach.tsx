import * as React from "react";

function SvgAttach(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M9.29 21a6.23 6.23 0 01-4.43-1.88 6 6 0 01-.22-8.49L12 3.2A4.11 4.11 0 0115 2a4.48 4.48 0 013.19 1.35 4.36 4.36 0 01.15 6.13l-7.4 7.43a2.54 2.54 0 01-1.81.75 2.72 2.72 0 01-1.95-.82 2.68 2.68 0 01-.08-3.77l6.83-6.86a1 1 0 011.37 1.41l-6.83 6.86a.68.68 0 00.08.95.78.78 0 00.53.23.56.56 0 00.4-.16l7.39-7.43a2.36 2.36 0 00-.15-3.31 2.38 2.38 0 00-3.27-.15L6.06 12a4 4 0 00.22 5.67 4.22 4.22 0 003 1.29 3.67 3.67 0 002.61-1.06l7.39-7.43a1 1 0 111.42 1.41l-7.39 7.43A5.65 5.65 0 019.29 21z"
          data-name="attach"
        />
      </g>
    </svg>
  );
}

export default SvgAttach;
