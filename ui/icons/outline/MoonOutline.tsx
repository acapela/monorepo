import * as React from "react";

function SvgMoonOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12.3 22h-.1a10.31 10.31 0 01-7.34-3.15 10.46 10.46 0 01-.26-14 10.13 10.13 0 014-2.74 1 1 0 011.06.22 1 1 0 01.24 1 8.4 8.4 0 001.94 8.81 8.47 8.47 0 008.83 1.94 1 1 0 011.27 1.29A10.16 10.16 0 0119.6 19a10.28 10.28 0 01-7.3 3zM7.46 4.92a7.93 7.93 0 00-1.37 1.22 8.44 8.44 0 00.2 11.32A8.29 8.29 0 0012.22 20h.08a8.34 8.34 0 006.78-3.49A10.37 10.37 0 017.46 4.92z"
          data-name="moon"
        />
      </g>
    </svg>
  );
}

export default SvgMoonOutline;
