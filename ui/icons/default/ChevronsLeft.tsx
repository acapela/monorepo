import * as React from "react";

function SvgChevronsLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.53 6.53a.75.75 0 00-1.06-1.06l-6 6a.75.75 0 000 1.06l6 6a.75.75 0 101.06-1.06L7.06 12l5.47-5.47zm4 2a.75.75 0 00-1.06-1.06l-4 4a.75.75 0 000 1.06l4 4a.75.75 0 101.06-1.06L13.06 12l3.47-3.47z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgChevronsLeft = React.memo(SvgChevronsLeft);
export default MemoSvgChevronsLeft;
