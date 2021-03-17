import * as React from "react";

function SvgPrinter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19.36 7H18V5a1.92 1.92 0 00-1.83-2H7.83A1.92 1.92 0 006 5v2H4.64A2.66 2.66 0 002 9.67v6.66A2.66 2.66 0 004.64 19h.86a2 2 0 002 2h9a2 2 0 002-2h.86A2.66 2.66 0 0022 16.33V9.67A2.66 2.66 0 0019.36 7zM8 5h8v2H8zm-.5 14v-4h9v4z"
          data-name="printer"
        />
      </g>
    </svg>
  );
}

export default SvgPrinter;
