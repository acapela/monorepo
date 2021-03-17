import * as React from "react";

function SvgInboxOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M20.79 11.34l-3.34-6.68A3 3 0 0014.76 3H9.24a3 3 0 00-2.69 1.66l-3.34 6.68a2 2 0 00-.21.9V18a3 3 0 003 3h12a3 3 0 003-3v-5.76a2 2 0 00-.21-.9zM8.34 5.55a1 1 0 01.9-.55h5.52a1 1 0 01.9.55L18.38 11H16a1 1 0 00-1 1v3H9v-3a1 1 0 00-1-1H5.62zM18 19H6a1 1 0 01-1-1v-5h2v3a1 1 0 001 1h8a1 1 0 001-1v-3h2v5a1 1 0 01-1 1z"
          data-name="inbox"
        />
      </g>
    </svg>
  );
}

export default SvgInboxOutline;
