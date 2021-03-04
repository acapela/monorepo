import * as React from "react";

function SvgShield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 21.85a2 2 0 01-1-.25l-.3-.17A15.17 15.17 0 013 8.23v-.14a2 2 0 011-1.75l7-3.94a2 2 0 012 0l7 3.94a2 2 0 011 1.75v.14a15.17 15.17 0 01-7.72 13.2l-.3.17a2 2 0 01-.98.25z"
          data-name="shield"
        />
      </g>
    </svg>
  );
}

export default SvgShield;
