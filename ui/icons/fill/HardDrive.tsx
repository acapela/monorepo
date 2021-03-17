import * as React from "react";

function SvgHardDrive(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M20.79 11.34l-3.34-6.68A3 3 0 0014.76 3H9.24a3 3 0 00-2.69 1.66l-3.34 6.68a2 2 0 00-.21.9V18a3 3 0 003 3h12a3 3 0 003-3v-5.76a2 2 0 00-.21-.9zM8 17a1 1 0 111-1 1 1 0 01-1 1zm8 0h-4a1 1 0 010-2h4a1 1 0 010 2zM5.62 11l2.72-5.45a1 1 0 01.9-.55h5.52a1 1 0 01.9.55L18.38 11z"
          data-name="hard-drive"
        />
      </g>
    </svg>
  );
}

export default SvgHardDrive;
