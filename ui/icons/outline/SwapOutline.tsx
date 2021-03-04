import * as React from "react";

function SvgSwapOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="swap">
          <path d="M4 9h13l-1.6 1.2a1 1 0 00-.2 1.4 1 1 0 00.8.4 1 1 0 00.6-.2l4-3a1 1 0 000-1.59l-3.86-3a1 1 0 00-1.23 1.58L17.08 7H4a1 1 0 000 2zM20 16H7l1.6-1.2a1 1 0 00-1.2-1.6l-4 3a1 1 0 000 1.59l3.86 3a1 1 0 00.61.21 1 1 0 00.79-.39 1 1 0 00-.17-1.4L6.92 18H20a1 1 0 000-2z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgSwapOutline;
