import * as React from "react";

function SvgFirstLine2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.25 4a.75.75 0 01.75-.75h7a.75.75 0 010 1.5h-7a.75.75 0 01-.75-.75zm-9 15a.75.75 0 01.75-.75h16a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75zM13 8.25a.75.75 0 000 1.5h7a.75.75 0 000-1.5h-7zM3.25 14a.75.75 0 01.75-.75h16a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75zm1.5-7.5a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0zM6.5 3.25a3.25 3.25 0 100 6.5 3.25 3.25 0 000-6.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgFirstLine2 = React.memo(SvgFirstLine2);
export default MemoSvgFirstLine2;
