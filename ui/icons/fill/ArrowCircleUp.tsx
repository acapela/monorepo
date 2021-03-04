import * as React from "react";

function SvgArrowCircleUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 22A10 10 0 102 12a10 10 0 0010 10zM8.31 10.14l3-2.86a.49.49 0 01.15-.1.54.54 0 01.16-.1.94.94 0 01.76 0 1 1 0 01.33.21l3 3a1 1 0 01-1.42 1.42L13 10.41V16a1 1 0 01-2 0v-5.66l-1.31 1.25a1 1 0 01-1.38-1.45z"
          data-name="arrow-circle-up"
        />
      </g>
    </svg>
  );
}

export default SvgArrowCircleUp;
