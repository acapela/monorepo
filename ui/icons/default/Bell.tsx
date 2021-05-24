import * as React from "react";

function SvgBell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.25a7.547 7.547 0 00-7.488 6.61l-.99 7.912a2.65 2.65 0 002.63 2.978h1.36l.053.118a4.853 4.853 0 008.87 0l.053-.118h1.36a2.65 2.65 0 002.63-2.978l-.99-7.911A7.547 7.547 0 0012 2.25zm4.017 16a.93.93 0 00-.033 0H8.016a.93.93 0 00-.033 0H6.152a1.15 1.15 0 01-1.14-1.292L6 9.047a6.047 6.047 0 0112 0l.99 7.911a1.15 1.15 0 01-1.141 1.292h-1.832zm-6.812 1.5h5.59a3.354 3.354 0 01-5.59 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBell = React.memo(SvgBell);
export default MemoSvgBell;
