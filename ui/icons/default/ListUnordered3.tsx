import * as React from "react";

function SvgListUnordered3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 5a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zM5 2.25a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5zM10.25 5a.75.75 0 01.75-.75h10a.75.75 0 010 1.5H11a.75.75 0 01-.75-.75zm.75 6.25a.75.75 0 000 1.5h10a.75.75 0 000-1.5H11zm0 7a.75.75 0 000 1.5h10a.75.75 0 000-1.5H11zm-6-7.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM2.25 12a2.75 2.75 0 115.5 0 2.75 2.75 0 01-5.5 0zm1.5 7a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zM5 16.25a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgListUnordered3 = React.memo(SvgListUnordered3);
export default MemoSvgListUnordered3;
