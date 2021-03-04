import * as React from "react";

function SvgArrowCircleDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm3.69 11.86l-3 2.86a.49.49 0 01-.15.1.54.54 0 01-.16.1.94.94 0 01-.76 0 1 1 0 01-.33-.21l-3-3a1 1 0 011.42-1.42l1.29 1.3V8a1 1 0 012 0v5.66l1.31-1.25a1 1 0 011.38 1.45z"
          data-name="arrow-circle-down"
        />
      </g>
    </svg>
  );
}

export default SvgArrowCircleDown;
