import * as React from "react";

function SvgBookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="book-open">
          <path d="M21 4.34a1.24 1.24 0 00-1.08-.23L13 5.89v14.27l7.56-1.94A1.25 1.25 0 0021.5 17V5.32a1.25 1.25 0 00-.5-.98zM11 5.89L4.06 4.11A1.27 1.27 0 003 4.34a1.25 1.25 0 00-.48 1V17a1.25 1.25 0 00.94 1.21L11 20.16z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgBookOpen;
