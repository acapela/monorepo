import * as React from "react";

function SvgSortText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 2.25A2.75 2.75 0 0014.25 5v4a.75.75 0 001.5 0V7.5h2.5V9a.75.75 0 001.5 0V5A2.75 2.75 0 0017 2.25zM18.25 5v1h-2.5V5a1.25 1.25 0 112.5 0zM7 5.25a.75.75 0 01.75.75v10.19l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l1.72 1.72V6A.75.75 0 017 5.25zM14.25 13a.75.75 0 01.75-.75h4a.75.75 0 01.624 1.166l-3.223 4.834H19a.75.75 0 010 1.5h-4a.75.75 0 01-.624-1.166l3.223-4.834H15a.75.75 0 01-.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgSortText = React.memo(SvgSortText);
export default MemoSvgSortText;
