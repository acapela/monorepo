import * as React from "react";

function SvgArrowBottomRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.47 5.47a.75.75 0 011.06 0l10.72 10.72V8.4a.75.75 0 011.5 0V18a.75.75 0 01-.75.75H8.4a.75.75 0 010-1.5h7.79L5.47 6.53a.75.75 0 010-1.06z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgArrowBottomRight = React.memo(SvgArrowBottomRight);
export default MemoSvgArrowBottomRight;
