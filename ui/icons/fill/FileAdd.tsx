import * as React from "react";

function SvgFileAdd(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19.74 7.33l-4.44-5a1 1 0 00-.74-.33h-8A2.53 2.53 0 004 4.5v15A2.53 2.53 0 006.56 22h10.88A2.53 2.53 0 0020 19.5V8a1 1 0 00-.26-.67zM14 15h-1v1a1 1 0 01-2 0v-1h-1a1 1 0 010-2h1v-1a1 1 0 012 0v1h1a1 1 0 010 2zm.71-7a.79.79 0 01-.71-.85V4l3.74 4z"
          data-name="file-add"
        />
      </g>
    </svg>
  );
}

export default SvgFileAdd;
