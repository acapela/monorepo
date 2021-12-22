import * as React from "react";

function SvgComment(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 2C0 0.89543 0.895431 0 2 0H10C11.1046 0 12 0.895431 12 2V7C12 8.10457 11.1046 9 10 9H6L3 12H2L2 9C0.895431 9 0 8.10457 0 7V2Z"
        fill="#9CA3AF"
      />
    </svg>
  );
}

const MemoSvgComment = React.memo(SvgComment);
export default MemoSvgComment;
