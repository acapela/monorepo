import * as React from "react";

function SvgCastOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="cast">
          <path d="M18.4 3H5.6A2.7 2.7 0 003 5.78V7a1 1 0 002 0V5.78A.72.72 0 015.6 5h12.8a.72.72 0 01.6.78v12.44a.72.72 0 01-.6.78H17a1 1 0 000 2h1.4a2.7 2.7 0 002.6-2.78V5.78A2.7 2.7 0 0018.4 3zM3.86 14A1 1 0 003 15.17a1 1 0 001.14.83 2.49 2.49 0 012.12.72 2.52 2.52 0 01.51 2.84 1 1 0 00.48 1.33 1.06 1.06 0 00.42.09 1 1 0 00.91-.58A4.52 4.52 0 003.86 14z" />
          <path d="M3.86 10.08a1 1 0 00.28 2 6 6 0 015.09 1.71 6 6 0 011.53 5.95 1 1 0 00.68 1.26.9.9 0 00.28 0 1 1 0 001-.72 8 8 0 00-8.82-10.2z" />
          <circle cx={4} cy={19} r={1} />
        </g>
      </g>
    </svg>
  );
}

export default SvgCastOutline;
