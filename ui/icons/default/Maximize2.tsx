import * as React from "react";

function SvgMaximize2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 5A.75.75 0 015 4.25h6a.75.75 0 010 1.5H6.81l11.44 11.44V13a.75.75 0 011.5 0v6a.75.75 0 01-.75.75h-6a.75.75 0 010-1.5h4.19L5.75 6.81V11a.75.75 0 01-1.5 0V5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgMaximize2 = React.memo(SvgMaximize2);
export default MemoSvgMaximize2;
