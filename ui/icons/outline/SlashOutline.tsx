import * as React from "react";

function SvgSlashOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm8 10a7.92 7.92 0 01-1.69 4.9L7.1 5.69A7.92 7.92 0 0112 4a8 8 0 018 8zM4 12a7.92 7.92 0 011.69-4.9L16.9 18.31A7.92 7.92 0 0112 20a8 8 0 01-8-8z"
          data-name="slash"
        />
      </g>
    </svg>
  );
}

export default SvgSlashOutline;
