import * as React from "react";

function SvgLayout(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="layout">
          <path d="M21 8V6a3 3 0 00-3-3H6a3 3 0 00-3 3v2zM3 10v8a3 3 0 003 3h5V10zM13 10v11h5a3 3 0 003-3v-8z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgLayout;
