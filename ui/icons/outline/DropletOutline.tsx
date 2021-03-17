import * as React from "react";

function SvgDropletOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.2 24.2" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 21.1a7.4 7.4 0 01-5.28-2.28 7.73 7.73 0 01.1-10.77l4.64-4.65a.94.94 0 01.71-.3 1 1 0 01.71.31l4.56 4.72a7.73 7.73 0 01-.09 10.77A7.33 7.33 0 0112 21.1zm.13-15.57L8.24 9.45a5.74 5.74 0 00-.07 8A5.43 5.43 0 0012 19.1a5.42 5.42 0 003.9-1.61 5.72 5.72 0 00.06-8z"
          data-name="droplet-outline"
        />
      </g>
    </svg>
  );
}

export default SvgDropletOutline;
