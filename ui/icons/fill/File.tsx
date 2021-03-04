import * as React from "react";

function SvgFile(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19.74 7.33l-4.44-5a1 1 0 00-.74-.33h-8A2.53 2.53 0 004 4.5v15A2.53 2.53 0 006.56 22h10.88A2.53 2.53 0 0020 19.5V8a1 1 0 00-.26-.67zM14 4l3.74 4h-3a.79.79 0 01-.74-.85z"
          data-name="file"
        />
      </g>
    </svg>
  );
}

export default SvgFile;
