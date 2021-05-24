import * as React from "react";

function SvgSticker(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.644 2.256a.75.75 0 01.557.22l9.323 9.323a.75.75 0 01.22.557c-.188 5.22-4.478 9.394-9.744 9.394-5.385 0-9.75-4.365-9.75-9.75 0-5.266 4.174-9.556 9.394-9.744zm-1.1 1.622a8.25 8.25 0 109.578 9.578 7.75 7.75 0 01-9.578-9.578zm1.423.484a6.25 6.25 0 007.671 7.671l-7.671-7.67z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgSticker = React.memo(SvgSticker);
export default MemoSvgSticker;
