import * as React from "react";

function SvgArrowBottomLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.53 5.47a.75.75 0 00-1.06 0L6.75 16.19V8.4a.75.75 0 00-1.5 0V18c0 .414.336.75.75.75h9.6a.75.75 0 100-1.5H7.81L18.53 6.53a.75.75 0 000-1.06z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgArrowBottomLeft = React.memo(SvgArrowBottomLeft);
export default MemoSvgArrowBottomLeft;
