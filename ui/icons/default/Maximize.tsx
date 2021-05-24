import * as React from "react";

function SvgMaximize(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 5A.75.75 0 015 4.25h6a.75.75 0 010 1.5H6.81l2.22 2.22 1.5 1.5a.75.75 0 11-1.06 1.06l-1.5-1.5-2.22-2.22V11a.75.75 0 01-1.5 0V5zM19 12.25a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-6a.75.75 0 010-1.5h4.19l-2.22-2.22-1.5-1.5a.75.75 0 111.06-1.06l1.5 1.5 2.22 2.22V13a.75.75 0 01.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgMaximize = React.memo(SvgMaximize);
export default MemoSvgMaximize;
