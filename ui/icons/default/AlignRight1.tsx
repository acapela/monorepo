import * as React from "react";

function SvgAlignRight1(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3.25a.75.75 0 000 1.5h16a.75.75 0 000-1.5H4zM7.25 9A.75.75 0 018 8.25h12a.75.75 0 010 1.5H8A.75.75 0 017.25 9zM6 13.25a.75.75 0 000 1.5h14a.75.75 0 000-1.5H6zm6 5a.75.75 0 000 1.5h8a.75.75 0 000-1.5h-8z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgAlignRight1 = React.memo(SvgAlignRight1);
export default MemoSvgAlignRight1;
