import * as React from "react";

function SvgThermometerOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 22a5 5 0 01-3-9V5a3 3 0 013-3 3 3 0 013 3v8a5 5 0 01-3 9zm0-18a1 1 0 00-1 1v8.54a1 1 0 01-.5.87A3 3 0 009 17a3 3 0 006 0 3 3 0 00-1.5-2.59 1 1 0 01-.5-.87V5a.93.93 0 00-.29-.69A1 1 0 0012 4z"
          data-name="thermometer"
        />
      </g>
    </svg>
  );
}

export default SvgThermometerOutline;
