import * as React from "react";

function SvgBrushOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M20 6.83a2.76 2.76 0 00-.82-2 2.89 2.89 0 00-4 0l-6.6 6.6h-.22a4.42 4.42 0 00-4.3 4.31L4 19a1 1 0 00.29.73A1.05 1.05 0 005 20l3.26-.06a4.42 4.42 0 004.31-4.3v-.23l6.61-6.6A2.74 2.74 0 0020 6.83zM8.25 17.94L6 18v-2.23a2.4 2.4 0 012.4-2.36 2.15 2.15 0 012.15 2.19 2.4 2.4 0 01-2.3 2.34zm9.52-10.55l-5.87 5.87a4.55 4.55 0 00-.52-.64 3.94 3.94 0 00-.64-.52l5.87-5.86a.84.84 0 011.16 0 .81.81 0 01.23.59.79.79 0 01-.23.56z"
          data-name="brush"
        />
      </g>
    </svg>
  );
}

export default SvgBrushOutline;
