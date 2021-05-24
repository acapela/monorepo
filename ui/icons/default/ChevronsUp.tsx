import * as React from "react";

function SvgChevronsUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.53 6.47a.75.75 0 00-1.06 0l-6 6a.75.75 0 101.06 1.06L12 8.06l5.47 5.47a.75.75 0 101.06-1.06l-6-6zm4 10l-4-4a.75.75 0 00-1.06 0l-4 4a.75.75 0 101.06 1.06L12 14.06l3.47 3.47a.75.75 0 101.06-1.06z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgChevronsUp = React.memo(SvgChevronsUp);
export default MemoSvgChevronsUp;
