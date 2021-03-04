import * as React from "react";

function SvgPercent(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="percent">
          <path d="M8 11a3.5 3.5 0 10-3.5-3.5A3.5 3.5 0 008 11zm0-5a1.5 1.5 0 11-1.5 1.5A1.5 1.5 0 018 6zM16 14a3.5 3.5 0 103.5 3.5A3.5 3.5 0 0016 14zm0 5a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0116 19zM19.74 4.26a.89.89 0 00-1.26 0L4.26 18.48a.91.91 0 00-.26.63.89.89 0 001.52.63L19.74 5.52a.89.89 0 000-1.26z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgPercent;
