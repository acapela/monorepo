import * as React from "react";

function SvgLoaderOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="loader">
          <path d="M12 2a1 1 0 00-1 1v2a1 1 0 002 0V3a1 1 0 00-1-1zM21 11h-2a1 1 0 000 2h2a1 1 0 000-2zM6 12a1 1 0 00-1-1H3a1 1 0 000 2h2a1 1 0 001-1zM6.22 5a1 1 0 00-1.39 1.47l1.44 1.39a1 1 0 00.73.28 1 1 0 00.72-.31 1 1 0 000-1.41zM17 8.14a1 1 0 00.69-.28l1.44-1.39A1 1 0 0017.78 5l-1.44 1.42a1 1 0 000 1.41 1 1 0 00.66.31zM12 18a1 1 0 00-1 1v2a1 1 0 002 0v-2a1 1 0 00-1-1zM17.73 16.14a1 1 0 00-1.39 1.44L17.78 19a1 1 0 00.69.28 1 1 0 00.72-.3 1 1 0 000-1.42zM6.27 16.14l-1.44 1.39a1 1 0 000 1.42 1 1 0 00.72.3 1 1 0 00.67-.25l1.44-1.39a1 1 0 00-1.39-1.44z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgLoaderOutline;
