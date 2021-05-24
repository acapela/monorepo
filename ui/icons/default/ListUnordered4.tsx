import * as React from "react";

function SvgListUnordered4(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.53 3.53a.75.75 0 00-1.06-1.06L4 4.94l-.47-.47a.75.75 0 00-1.06 1.06l1 1a.75.75 0 001.06 0l3-3zM10.25 5a.75.75 0 01.75-.75h10a.75.75 0 010 1.5H11a.75.75 0 01-.75-.75zm.75 6.25a.75.75 0 000 1.5h10a.75.75 0 000-1.5H11zm0 7a.75.75 0 000 1.5h10a.75.75 0 000-1.5H11zM7.53 9.47a.75.75 0 010 1.06l-3 3a.75.75 0 01-1.06 0l-1-1a.75.75 0 111.06-1.06l.47.47 2.47-2.47a.75.75 0 011.06 0zm0 8.06a.75.75 0 10-1.06-1.06L4 18.94l-.47-.47a.75.75 0 00-1.06 1.06l1 1a.75.75 0 001.06 0l3-3z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgListUnordered4 = React.memo(SvgListUnordered4);
export default MemoSvgListUnordered4;
