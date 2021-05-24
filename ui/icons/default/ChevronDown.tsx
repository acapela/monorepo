import * as React from "react";

function SvgChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.47 8.47a.75.75 0 011.06 0L12 13.94l5.47-5.47a.75.75 0 111.06 1.06l-6 6a.75.75 0 01-1.06 0l-6-6a.75.75 0 010-1.06z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgChevronDown = React.memo(SvgChevronDown);
export default MemoSvgChevronDown;
