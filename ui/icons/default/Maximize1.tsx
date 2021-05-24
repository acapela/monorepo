import * as React from "react";

function SvgMaximize1(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.25 5a.75.75 0 01.75-.75h6a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0V6.81l-2.22 2.22-1.5 1.5a.75.75 0 11-1.06-1.06l1.5-1.5 2.22-2.22H13a.75.75 0 01-.75-.75zM5 12.25a.75.75 0 01.75.75v4.19l2.22-2.22 1.5-1.5a.75.75 0 111.06 1.06l-1.5 1.5-2.22 2.22H11a.75.75 0 010 1.5H5a.75.75 0 01-.75-.75v-6a.75.75 0 01.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgMaximize1 = React.memo(SvgMaximize1);
export default MemoSvgMaximize1;
