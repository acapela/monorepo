import * as React from "react";

function SvgGlobe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M22 12A10 10 0 0012 2a10 10 0 000 20 10 10 0 0010-10zm-2.07-1H17a12.91 12.91 0 00-2.33-6.54A8 8 0 0119.93 11zM9.08 13H15a11.44 11.44 0 01-3 6.61A11 11 0 019.08 13zm0-2A11.4 11.4 0 0112 4.4a11.19 11.19 0 013 6.6zm.36-6.57A13.18 13.18 0 007.07 11h-3a8 8 0 015.37-6.57zM4.07 13h3a12.86 12.86 0 002.35 6.56A8 8 0 014.07 13zm10.55 6.55A13.14 13.14 0 0017 13h2.95a8 8 0 01-5.33 6.55z"
          data-name="globe"
        />
      </g>
    </svg>
  );
}

export default SvgGlobe;
