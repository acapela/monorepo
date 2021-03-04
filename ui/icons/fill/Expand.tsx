import * as React from "react";

function SvgExpand(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="expand">
          <path d="M20 5a1 1 0 00-1-1h-5a1 1 0 000 2h2.57l-3.28 3.29a1 1 0 000 1.42 1 1 0 001.42 0L18 7.42V10a1 1 0 001 1 1 1 0 001-1zM10.71 13.29a1 1 0 00-1.42 0L6 16.57V14a1 1 0 00-1-1 1 1 0 00-1 1v5a1 1 0 001 1h5a1 1 0 000-2H7.42l3.29-3.29a1 1 0 000-1.42z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgExpand;
