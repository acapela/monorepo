import * as React from "react";

function SvgFirstLine3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.25 4a.75.75 0 01.75-.75h7a.75.75 0 010 1.5h-7a.75.75 0 01-.75-.75zm-9 15a.75.75 0 01.75-.75h16a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75zM13 8.25a.75.75 0 000 1.5h7a.75.75 0 000-1.5h-7zM3.25 14a.75.75 0 01.75-.75h16a.75.75 0 110 1.5H4a.75.75 0 01-.75-.75zM4 3.25a.75.75 0 000 1.5h1.75V9a.75.75 0 001.5 0V4.75H9a.75.75 0 100-1.5H4z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgFirstLine3 = React.memo(SvgFirstLine3);
export default MemoSvgFirstLine3;
