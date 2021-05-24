import * as React from "react";

function SvgIndentFirstLine(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.25 4a.75.75 0 01.75-.75h8a.75.75 0 010 1.5h-8a.75.75 0 01-.75-.75zm-8 15a.75.75 0 01.75-.75h16a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75zM12 8.25a.75.75 0 000 1.5h8a.75.75 0 000-1.5h-8zM4.47 3.47a.75.75 0 011.06 0l2.5 2.5a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 11-1.06-1.06L6.44 6.5 4.47 4.53a.75.75 0 010-1.06zM4 13.25a.75.75 0 100 1.5h16a.75.75 0 000-1.5H4z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgIndentFirstLine = React.memo(SvgIndentFirstLine);
export default MemoSvgIndentFirstLine;
