import * as React from "react";

function SvgAnchor(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.25 5a3.75 3.75 0 114.5 3.675v12.537a7.253 7.253 0 006.462-6.462H17a.75.75 0 010-1.5h3a.75.75 0 01.75.75 8.75 8.75 0 11-17.5 0 .75.75 0 01.75-.75h3a.75.75 0 010 1.5H4.788a7.253 7.253 0 006.462 6.462V8.675A3.751 3.751 0 018.25 5zm6 0a2.25 2.25 0 01-2.249 2.25H12A2.25 2.25 0 1114.25 5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgAnchor = React.memo(SvgAnchor);
export default MemoSvgAnchor;
