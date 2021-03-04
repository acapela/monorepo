import * as React from "react";

function SvgSunOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="sun">
          <path d="M12 6a1 1 0 001-1V3a1 1 0 00-2 0v2a1 1 0 001 1zM21 11h-2a1 1 0 000 2h2a1 1 0 000-2zM6 12a1 1 0 00-1-1H3a1 1 0 000 2h2a1 1 0 001-1zM6.22 5a1 1 0 00-1.39 1.47l1.44 1.39a1 1 0 00.73.28 1 1 0 00.72-.31 1 1 0 000-1.41zM17 8.14a1 1 0 00.69-.28l1.44-1.39A1 1 0 0017.78 5l-1.44 1.42a1 1 0 000 1.41 1 1 0 00.66.31zM12 18a1 1 0 00-1 1v2a1 1 0 002 0v-2a1 1 0 00-1-1zM17.73 16.14a1 1 0 00-1.39 1.44L17.78 19a1 1 0 00.69.28 1 1 0 00.72-.3 1 1 0 000-1.42zM6.27 16.14l-1.44 1.39a1 1 0 000 1.42 1 1 0 00.72.3 1 1 0 00.67-.25l1.44-1.39a1 1 0 00-1.39-1.44zM12 8a4 4 0 104 4 4 4 0 00-4-4zm0 6a2 2 0 112-2 2 2 0 01-2 2z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgSunOutline;
