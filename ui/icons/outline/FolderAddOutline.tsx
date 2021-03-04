import * as React from "react";

function SvgFolderAddOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="folder-add">
          <path d="M14 13h-1v-1a1 1 0 00-2 0v1h-1a1 1 0 000 2h1v1a1 1 0 002 0v-1h1a1 1 0 000-2z" />
          <path d="M19.5 7.05h-7L9.87 3.87a1 1 0 00-.77-.37H4.5A2.47 2.47 0 002 5.93v12.14a2.47 2.47 0 002.5 2.43h15a2.47 2.47 0 002.5-2.43V9.48a2.47 2.47 0 00-2.5-2.43zm.5 11a.46.46 0 01-.5.43h-15a.46.46 0 01-.5-.43V5.93a.46.46 0 01.5-.43h4.13l2.6 3.18a1 1 0 00.77.37h7.5a.46.46 0 01.5.43z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgFolderAddOutline;
