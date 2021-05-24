import * as React from "react";

function SvgChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.53 5.47a.75.75 0 010 1.06L9.06 12l5.47 5.47a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgChevronLeft = React.memo(SvgChevronLeft);
export default MemoSvgChevronLeft;
