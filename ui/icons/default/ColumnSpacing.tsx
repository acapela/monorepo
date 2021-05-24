import * as React from "react";

function SvgColumnSpacing(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 3.25a.75.75 0 01.75.75v16a.75.75 0 01-1.5 0V4A.75.75 0 012 3.25zm20 0a.75.75 0 01.75.75v16a.75.75 0 01-1.5 0V4a.75.75 0 01.75-.75zm-3.47 9.28a.75.75 0 000-1.06l-2.5-2.5a.75.75 0 10-1.06 1.06l1.22 1.22H7.81l1.22-1.22a.75.75 0 10-1.06-1.06l-2.5 2.5a.75.75 0 000 1.06l2.5 2.5a.75.75 0 001.06-1.06l-1.22-1.22h8.38l-1.22 1.22a.75.75 0 101.06 1.06l2.5-2.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgColumnSpacing = React.memo(SvgColumnSpacing);
export default MemoSvgColumnSpacing;
