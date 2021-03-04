import * as React from "react";

function SvgFacebookOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M13 22H9a1 1 0 01-1-1v-6.2H6a1 1 0 01-1-1v-3.6a1 1 0 011-1h2V7.5A5.77 5.77 0 0114 2h3a1 1 0 011 1v3.6a1 1 0 01-1 1h-3v1.6h3a1 1 0 01.8.39 1 1 0 01.16.88l-1 3.6a1 1 0 01-1 .73H14V21a1 1 0 01-1 1zm-3-2h2v-6.2a1 1 0 011-1h2.24l.44-1.6H13a1 1 0 01-1-1V7.5a2 2 0 012-1.9h2V4h-2a3.78 3.78 0 00-4 3.5v2.7a1 1 0 01-1 1H7v1.6h2a1 1 0 011 1z"
          data-name="facebook"
        />
      </g>
    </svg>
  );
}

export default SvgFacebookOutline;
