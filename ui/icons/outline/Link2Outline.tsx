import * as React from "react";

function SvgLink2Outline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="link-2">
          <path d="M13.29 9.29l-4 4a1 1 0 000 1.42 1 1 0 001.42 0l4-4a1 1 0 00-1.42-1.42z" />
          <path d="M12.28 17.4L11 18.67a4.2 4.2 0 01-5.58.4 4 4 0 01-.27-5.93l1.42-1.43a1 1 0 000-1.42 1 1 0 00-1.42 0l-1.27 1.28a6.15 6.15 0 00-.67 8.07 6.06 6.06 0 009.07.6l1.42-1.42a1 1 0 00-1.42-1.42zM19.66 3.22a6.18 6.18 0 00-8.13.68L10.45 5a1.09 1.09 0 00-.17 1.61 1 1 0 001.42 0L13 5.3a4.17 4.17 0 015.57-.4 4 4 0 01.27 5.95l-1.42 1.43a1 1 0 000 1.42 1 1 0 001.42 0l1.42-1.42a6.06 6.06 0 00-.6-9.06z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgLink2Outline;
