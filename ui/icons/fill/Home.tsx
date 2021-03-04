import * as React from "react";

function SvgHome(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="home">
          <path d="M10 14h4v7h-4z" />
          <path d="M20.42 10.18L12.71 2.3a1 1 0 00-1.42 0l-7.71 7.89A2 2 0 003 11.62V20a2 2 0 001.89 2H8v-9a1 1 0 011-1h6a1 1 0 011 1v9h3.11A2 2 0 0021 20v-8.38a2.07 2.07 0 00-.58-1.44z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgHome;
