import * as React from "react";

function SvgAlignCenter2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 4.25a.75.75 0 000 1.5h16a.75.75 0 000-1.5H4zM6.25 12a.75.75 0 01.75-.75h10a.75.75 0 010 1.5H7a.75.75 0 01-.75-.75zm-3 7a.75.75 0 01.75-.75h16a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgAlignCenter2 = React.memo(SvgAlignCenter2);
export default MemoSvgAlignCenter2;
