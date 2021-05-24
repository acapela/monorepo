import * as React from "react";

function SvgBellCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.512 8.86a7.547 7.547 0 0114.977 0l.988 7.912a2.65 2.65 0 01-2.628 2.978h-1.361l-.053.118a4.853 4.853 0 01-8.87 0l-.052-.118H6.152a2.65 2.65 0 01-2.63-2.978l.99-7.911zm3.504 9.39a.93.93 0 00-.033 0H6.152a1.15 1.15 0 01-1.14-1.292L6 9.047a6.047 6.047 0 0112 0l.99 7.911a1.15 1.15 0 01-1.141 1.292h-1.832a.93.93 0 00-.033 0H8.016zm1.19 1.5a3.354 3.354 0 005.589 0h-5.59zM15.53 9.47a.75.75 0 010 1.06l-4 4a.75.75 0 01-1.061 0l-1.5-1.5a.75.75 0 111.06-1.06l.97.97 3.47-3.47a.75.75 0 011.06 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBellCheck = React.memo(SvgBellCheck);
export default MemoSvgBellCheck;
