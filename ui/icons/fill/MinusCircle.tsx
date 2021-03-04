import * as React from "react";

function SvgMinusCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm3 11H9a1 1 0 010-2h6a1 1 0 010 2z" data-name="minus-circle" />
      </g>
    </svg>
  );
}

export default SvgMinusCircle;
