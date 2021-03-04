import * as React from "react";

function SvgTrendingUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M21 7a.78.78 0 000-.21.64.64 0 00-.05-.17 1.1 1.1 0 00-.09-.14.75.75 0 00-.14-.17l-.12-.07a.69.69 0 00-.19-.1h-.2A.7.7 0 0020 6h-5a1 1 0 000 2h2.83l-4 4.71-4.32-2.57a1 1 0 00-1.28.22l-5 6a1 1 0 00.13 1.41A1 1 0 004 18a1 1 0 00.77-.36l4.45-5.34 4.27 2.56a1 1 0 001.27-.21L19 9.7V12a1 1 0 002 0V7z"
          data-name="trending-up"
        />
      </g>
    </svg>
  );
}

export default SvgTrendingUp;
