import * as React from "react";

function SvgFlagOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19.27 4.68a1.79 1.79 0 00-1.6-.25 7.53 7.53 0 01-2.17.28 8.54 8.54 0 01-3.13-.78A10.15 10.15 0 008.5 3c-2.89 0-4 1-4.2 1.14a1 1 0 00-.3.72V20a1 1 0 002 0v-4.3a6.28 6.28 0 012.5-.41 8.54 8.54 0 013.13.78 10.15 10.15 0 003.87.93 7.66 7.66 0 003.5-.7 1.74 1.74 0 001-1.55V6.11a1.77 1.77 0 00-.73-1.43zM18 14.59a6.32 6.32 0 01-2.5.41 8.36 8.36 0 01-3.13-.79 10.34 10.34 0 00-3.87-.92 9.51 9.51 0 00-2.5.29V5.42A6.13 6.13 0 018.5 5a8.36 8.36 0 013.13.79 10.34 10.34 0 003.87.92 9.41 9.41 0 002.5-.3z"
          data-name="flag"
        />
      </g>
    </svg>
  );
}

export default SvgFlagOutline;
