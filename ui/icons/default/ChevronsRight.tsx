import * as React from "react";

function SvgChevronsRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.53 5.47a.75.75 0 10-1.06 1.06L16.94 12l-5.47 5.47a.75.75 0 101.06 1.06l6-6a.75.75 0 000-1.06l-6-6zm-4 2a.75.75 0 00-1.06 1.06L10.94 12l-3.47 3.47a.75.75 0 101.06 1.06l4-4a.75.75 0 000-1.06l-4-4z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgChevronsRight = React.memo(SvgChevronsRight);
export default MemoSvgChevronsRight;
