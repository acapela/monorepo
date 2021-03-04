import * as React from "react";

function SvgWifi(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="wifi">
          <circle cx={12} cy={19} r={1} />
          <path d="M12 14a5 5 0 00-3.47 1.4 1 1 0 101.39 1.44 3.08 3.08 0 014.16 0 1 1 0 101.39-1.44A5 5 0 0012 14zM12 9a9 9 0 00-6.47 2.75A1 1 0 007 13.14a7 7 0 0110.08 0 1 1 0 00.71.3 1 1 0 00.72-1.69A9 9 0 0012 9z" />
          <path d="M21.72 7.93a14 14 0 00-19.44 0 1 1 0 001.38 1.44 12 12 0 0116.68 0 1 1 0 00.69.28 1 1 0 00.72-.31 1 1 0 00-.03-1.41z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgWifi;
