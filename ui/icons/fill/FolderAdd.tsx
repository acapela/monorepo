import * as React from "react";

function SvgFolderAdd(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19.5 7.05h-7L9.87 3.87a1 1 0 00-.77-.37H4.5A2.47 2.47 0 002 5.93v12.14a2.47 2.47 0 002.5 2.43h15a2.47 2.47 0 002.5-2.43V9.48a2.47 2.47 0 00-2.5-2.43zM14 15h-1v1a1 1 0 01-2 0v-1h-1a1 1 0 010-2h1v-1a1 1 0 012 0v1h1a1 1 0 010 2z"
          data-name="folder-add"
        />
      </g>
    </svg>
  );
}

export default SvgFolderAdd;
