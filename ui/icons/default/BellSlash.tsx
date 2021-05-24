import * as React from "react";

function SvgBellSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.113 3.327A7.547 7.547 0 0119.488 8.86l.756 6.047a.75.75 0 01-1.488.186L18 9.047a6.047 6.047 0 00-9.113-4.434.75.75 0 11-.774-1.286zM6 9.047c.102-.812.36-1.569.744-2.242L18.19 18.25h-2.172a.93.93 0 00-.033 0H8.016a.93.93 0 00-.033 0H6.152a1.15 1.15 0 01-1.14-1.292L6 9.047zM7.513 19.75H6.152a2.65 2.65 0 01-2.63-2.978l.99-7.911a7.525 7.525 0 011.14-3.148L3.47 3.53a.75.75 0 011.06-1.06l18 18a.75.75 0 11-1.06 1.06l-1.78-1.78h-3.203l-.052.118a4.853 4.853 0 01-8.87 0l-.052-.118zm1.692 0a3.354 3.354 0 005.59 0h-5.59z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBellSlash = React.memo(SvgBellSlash);
export default MemoSvgBellSlash;
