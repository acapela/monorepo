import * as React from "react";

function SvgCompassOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="compass">
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z" />
          <path d="M15.68 8.32a1 1 0 00-1.1-.25l-4.21 1.7a1 1 0 00-.55.55l-1.75 4.26a1 1 0 00.18 1h.05A1 1 0 009 16a1 1 0 00.38-.07l4.21-1.7a1 1 0 00.55-.55l1.75-4.26a1 1 0 00-.21-1.1zm-4.88 4.89l.71-1.74 1.69-.68-.71 1.74z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgCompassOutline;
