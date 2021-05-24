import * as React from "react";

function SvgBorderOuter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3.25a.75.75 0 00-.75.75v16c0 .414.336.75.75.75h16a.75.75 0 00.75-.75V4a.75.75 0 00-.75-.75H4zM4.75 12V4.75h14.5v14.5H4.75V12zM13 8a1 1 0 11-2 0 1 1 0 012 0zm-5 5a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2zm-4 4a1 1 0 100-2 1 1 0 000 2zm1-5a1 1 0 11-2 0 1 1 0 012 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBorderOuter = React.memo(SvgBorderOuter);
export default MemoSvgBorderOuter;
