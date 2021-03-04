import * as React from "react";

function SvgFolderOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19.5 20.5h-15A2.47 2.47 0 012 18.07V5.93A2.47 2.47 0 014.5 3.5h4.6a1 1 0 01.77.37l2.6 3.18h7A2.47 2.47 0 0122 9.48v8.59a2.47 2.47 0 01-2.5 2.43zM4 13.76v4.31a.46.46 0 00.5.43h15a.46.46 0 00.5-.43V9.48a.46.46 0 00-.5-.43H12a1 1 0 01-.77-.37L8.63 5.5H4.5a.46.46 0 00-.5.43z"
          data-name="folder"
        />
      </g>
    </svg>
  );
}

export default SvgFolderOutline;
