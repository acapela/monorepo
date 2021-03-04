import * as React from "react";

function SvgDroplet(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.2 24.2" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 21.1a7.4 7.4 0 01-5.28-2.28 7.73 7.73 0 01.1-10.77l4.64-4.65a.94.94 0 01.71-.3 1 1 0 01.71.31l4.56 4.72a7.73 7.73 0 01-.09 10.77A7.33 7.33 0 0112 21.1z"
          data-name="droplet"
        />
      </g>
    </svg>
  );
}

export default SvgDroplet;
